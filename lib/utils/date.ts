export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayIndex = firstDay.getDay();

  const calendarDays: Date[] = [];

  for (let i = 0; i < startingDayIndex; i++) {
    calendarDays.push(new Date(year, month, -startingDayIndex + i + 1));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const remainingDays = 7 - (calendarDays.length % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push(new Date(year, month + 1, i));
    }
  }

  return calendarDays;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export interface Event {
  id: string;
  date: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export function getEventsForDate(events: Event[], date: Date): Event[] {
  const dateString = formatDate(date);
  return events.filter(event => event.date === dateString);
}

