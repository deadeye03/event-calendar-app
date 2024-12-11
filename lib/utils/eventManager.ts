import { Event } from './date';

const STORAGE_KEY = 'calendar_events';

export function saveEvents(events: Event[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function loadEvents(): Event[] {
  const eventsJson = localStorage.getItem(STORAGE_KEY);
  return eventsJson ? JSON.parse(eventsJson) : [];
}

export function addEvent(events: Event[], newEvent: Omit<Event, 'id'>): Event[] {
  const event: Event = {
    ...newEvent,
    id: Date.now().toString(),
  };
  const updatedEvents = [...events, event];
  saveEvents(updatedEvents);
  return updatedEvents;
}

export function updateEvent(events: Event[], updatedEvent: Event): Event[] {
  const updatedEvents = events.map(event => 
    event.id === updatedEvent.id ? updatedEvent : event
  );
  saveEvents(updatedEvents);
  return updatedEvents;
}

export function deleteEvent(events: Event[], eventId: string): Event[] {
  const updatedEvents = events.filter(event => event.id !== eventId);
  saveEvents(updatedEvents);
  return updatedEvents;
}

export function exportEventsAsJSON(events: Event[]): string {
    return JSON.stringify(events, null, 2);
  }
  
  export function exportEventsAsCSV(events: Event[]): string {
    const headers = ['id', 'date', 'name', 'startTime', 'endTime', 'description', 'color'];
    const csvRows = [
      headers.join(','),
      ...events.map(event => 
        headers.map(header => 
          JSON.stringify(event[header as keyof Event] || '')
        ).join(',')
      )
    ];
    return csvRows.join('\n');
  }