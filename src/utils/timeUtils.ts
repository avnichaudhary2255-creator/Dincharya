/**
 * Time utility functions for Dincharya Smart Planner
 */

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export function format12Hour(timeStr: string): string {
  if (!timeStr) return '';
  const totalMins = timeToMinutes(timeStr);
  const hours24 = Math.floor(totalMins / 60);
  const minutes = totalMins % 60;
  
  const period = hours24 >= 12 ? 'PM' : 'AM';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;
  
  const mmStr = minutes.toString().padStart(2, '0');
  return `${hours12}:${mmStr} ${period}`;
}

export function calculateDuration(startTime: string, endTime: string): number {
  const start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);
  if (end < start) {
    end += 1440; // overnight
  }
  return end - start;
}

export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const current = timeToMinutes(timeStr);
  return minutesToTime(current + minutesToAdd);
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0 min';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

export function getCurrentMinutesToday(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function formatTimeRemaining(endTimeStr: string, currentMinutes: number): string {
  const end = timeToMinutes(endTimeStr);
  let diff = end - currentMinutes;
  if (diff < 0 && diff > -1440) {
    diff += 1440; // handles overnight
  }
  if (diff <= 0) return 'Just finished';
  if (diff < 60) return `${diff} min left`;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${hrs}h ${mins}m left`;
}

export function formatTimeUntilStart(startTimeStr: string, currentMinutes: number): string {
  const start = timeToMinutes(startTimeStr);
  let diff = start - currentMinutes;
  if (diff < 0) {
    diff += 1440;
  }
  if (diff <= 0) return 'Starting now';
  if (diff < 60) return `in ${diff}m`;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return `in ${hrs}h ${mins}m`;
}
