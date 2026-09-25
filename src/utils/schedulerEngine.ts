import { Activity, ScheduleConflict, SmartAdjustResult } from '../types/routine';
import {
  timeToMinutes,
  minutesToTime,
  calculateDuration,
  format12Hour,
  addMinutesToTime,
} from './timeUtils';

export function detectConflicts(activities: Activity[]): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  // Sort activities chronologically for inspection
  const sorted = [...activities].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  for (let i = 0; i < sorted.length; i++) {
    const actA = sorted[i];
    const startA = timeToMinutes(actA.startTime);
    let endA = timeToMinutes(actA.endTime);
    if (endA <= startA) endA += 1440; // overnight

    for (let j = i + 1; j < sorted.length; j++) {
      const actB = sorted[j];
      const startB = timeToMinutes(actB.startTime);
      let endB = timeToMinutes(actB.endTime);
      if (endB <= startB) endB += 1440;

      // Check overlap
      const overlapStart = Math.max(startA, startB);
      const overlapEnd = Math.min(endA, endB);

      if (overlapEnd > overlapStart) {
        const overlapMinutes = overlapEnd - overlapStart;
        conflicts.push({
          id: `conflict_${actA.id}_${actB.id}`,
          activity1: actA,
          activity2: actB,
          overlapMinutes,
          message: `"${actA.title}" and "${actB.title}" overlap by ${overlapMinutes} minutes (${format12Hour(
            minutesToTime(overlapStart)
          )} – ${format12Hour(minutesToTime(overlapEnd))}).`,
        });
      }
    }
  }

  return conflicts;
}

interface FreeGap {
  start: number; // in minutes from 00:00
  end: number;   // in minutes from 00:00
  duration: number;
}

export function smartAdjustSchedule(activities: Activity[]): SmartAdjustResult {
  if (activities.length === 0) {
    return {
      activities: [],
      adjustmentsMade: [],
      conflicts: [],
      totalOccupiedMinutes: 0,
      totalFreeMinutes: 1440,
      workStudyMinutes: 0,
    };
  }

  const adjustmentsMade: string[] = [];

  // Step 1 & 2: Separate Fixed/Locked and Flexible
  const fixedLocked = activities.filter((a) => a.type === 'fixed' || a.isLocked);
  const flexible = activities.filter((a) => a.type === 'flexible' && !a.isLocked);

  // If there are no flexible activities, check for conflicts and return
  if (flexible.length === 0) {
    const conflicts = detectConflicts(activities);
    let totalOcc = 0;
    let wsMin = 0;
    for (const a of activities) {
      totalOcc += a.durationMinutes;
      if (a.category === 'work' || a.category === 'study') wsMin += a.durationMinutes;
    }
    return {
      activities: [...activities].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
      adjustmentsMade: ['All activities are fixed or locked; no flexible slots needed adjustment.'],
      conflicts,
      totalOccupiedMinutes: totalOcc,
      totalFreeMinutes: Math.max(0, 1440 - totalOcc),
      workStudyMinutes: wsMin,
    };
  }

  // Step 3: Sort fixed activities chronologically
  interface NormalizedRange {
    id: string;
    start: number;
    end: number;
    activity: Activity;
  }

  const fixedRanges: NormalizedRange[] = fixedLocked.map((item) => {
    const s = timeToMinutes(item.startTime);
    let e = timeToMinutes(item.endTime);
    if (e <= s) e += 1440;
    return { id: item.id, start: s, end: e, activity: item };
  });

  fixedRanges.sort((a, b) => a.start - b.start);

  // Step 4: Compute available time gaps around fixed activities across the active day
  // To keep routine intuitive, we compute gaps between 00:00 and 1440 (24h)
  const availableGaps: FreeGap[] = [];
  let currentPointer = 0;

  for (const fix of fixedRanges) {
    if (fix.start > currentPointer) {
      const gapDur = fix.start - currentPointer;
      if (gapDur >= 10) {
        availableGaps.push({
          start: currentPointer,
          end: fix.start,
          duration: gapDur,
        });
      }
    }
    currentPointer = Math.max(currentPointer, fix.end);
  }

  if (currentPointer < 1440) {
    const gapDur = 1440 - currentPointer;
    if (gapDur >= 10) {
      availableGaps.push({
        start: currentPointer,
        end: 1440,
        duration: gapDur,
      });
    }
  }

  // Step 5: Sort flexible activities by priority (High > Medium > Low), then by original startTime
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const sortedFlexible = [...flexible].sort((a, b) => {
    const pA = priorityWeight[a.priority || 'medium'];
    const pB = priorityWeight[b.priority || 'medium'];
    if (pA !== pB) return pB - pA; // Higher priority first
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

  const updatedFlexible: Activity[] = [];

  // Step 6 & 7: Place flexible activities into suitable gaps without overlap
  for (const flex of sortedFlexible) {
    const needed = flex.durationMinutes || calculateDuration(flex.startTime, flex.endTime) || 60;
    let placed = false;

    // Check if the flexible activity's CURRENT time has any overlap with fixed activities
    const flexStart = timeToMinutes(flex.startTime);
    let flexEnd = timeToMinutes(flex.endTime);
    if (flexEnd <= flexStart) flexEnd += 1440;

    let hasDirectCollision = false;
    for (const fix of fixedRanges) {
      if (Math.max(flexStart, fix.start) < Math.min(flexEnd, fix.end)) {
        hasDirectCollision = true;
        break;
      }
    }

    // Find the best gap
    // If it has a direct collision or needs movement:
    // Prefer gaps close to the original preferred time
    let bestGapIndex = -1;
    let minDistance = Infinity;

    for (let g = 0; g < availableGaps.length; g++) {
      const gap = availableGaps[g];
      if (gap.duration >= needed) {
        // Distance to original planned start time
        const dist = Math.abs(gap.start - flexStart);
        if (dist < minDistance) {
          minDistance = dist;
          bestGapIndex = g;
        }
      }
    }

    // Fallback: If no single gap has full duration, find largest available gap >= 15m
    if (bestGapIndex === -1) {
      let maxDur = 0;
      for (let g = 0; g < availableGaps.length; g++) {
        if (availableGaps[g].duration > maxDur && availableGaps[g].duration >= 15) {
          maxDur = availableGaps[g].duration;
          bestGapIndex = g;
        }
      }
    }

    if (bestGapIndex !== -1) {
      const targetGap = availableGaps[bestGapIndex];
      const allocatedDuration = Math.min(needed, targetGap.duration);
      const newStartMins = targetGap.start;
      const newEndMins = newStartMins + allocatedDuration;

      const newStartStr = minutesToTime(newStartMins);
      const newEndStr = minutesToTime(newEndMins);

      const oldTimeDesc = `${format12Hour(flex.startTime)}–${format12Hour(flex.endTime)}`;
      const newTimeDesc = `${format12Hour(newStartStr)}–${format12Hour(newEndStr)}`;

      if (newStartStr !== flex.startTime || newEndStr !== flex.endTime) {
        adjustmentsMade.push(
          `Moved "${flex.title}" (${flex.priority} priority) from ${oldTimeDesc} → ${newTimeDesc} to avoid overlaps.`
        );
      } else {
        adjustmentsMade.push(
          `Preserved "${flex.title}" timing at ${newTimeDesc} with zero conflicts.`
        );
      }

      updatedFlexible.push({
        ...flex,
        startTime: newStartStr,
        endTime: newEndStr,
        durationMinutes: allocatedDuration,
      });

      // Update the gap
      targetGap.start = newEndMins;
      targetGap.duration = targetGap.end - targetGap.start;
      placed = true;
    } else {
      // Could not place within remaining gaps
      adjustmentsMade.push(
        `⚠️ Could not fit "${flex.title}" (${needed}m) because total fixed commitments took up all open time.`
      );
      updatedFlexible.push(flex);
    }
  }

  // Combine fixed and newly positioned flexible activities
  const allFinalActivities = [...fixedLocked, ...updatedFlexible];
  allFinalActivities.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // Step 8: Detect any remaining conflicts
  const conflicts = detectConflicts(allFinalActivities);

  // Compute metrics
  let totalOccupiedMinutes = 0;
  let workStudyMinutes = 0;
  for (const act of allFinalActivities) {
    totalOccupiedMinutes += act.durationMinutes;
    if (act.category === 'work' || act.category === 'study') {
      workStudyMinutes += act.durationMinutes;
    }
  }

  const totalFreeMinutes = Math.max(0, 1440 - totalOccupiedMinutes);

  return {
    activities: allFinalActivities,
    adjustmentsMade,
    conflicts,
    totalOccupiedMinutes,
    totalFreeMinutes,
    workStudyMinutes,
  };
}
