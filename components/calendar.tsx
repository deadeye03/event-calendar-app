"use client"

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DAYS_OF_WEEK, getMonthDays, isSameDay, isSameMonth, Event, getEventsForDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils'
import { EventModal } from './event-modal'
import { EventList } from './event-list'
import { loadEvents, addEvent, updateEvent, deleteEvent,exportEventsAsJSON,exportEventsAsCSV } from '@/lib/utils/eventManager'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined)

  useEffect(() => {
    setEvents(loadEvents())
  }, [])

  const calendarDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth())

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (selectedEvent) {
      const updatedEvent = { ...eventData, id: selectedEvent.id }
      setEvents(updateEvent(events, updatedEvent))
    } else {
      setEvents(addEvent(events, eventData))
    }
    setSelectedEvent(undefined)
  }

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(deleteEvent(events, selectedEvent.id))
      setSelectedEvent(undefined)
    }
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleExport = (format: 'json' | 'csv') => {
    const currentMonthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
    });

    let content: string;
    let mimeType: string;
    let fileExtension: string;

    if (format === 'json') {
      content = exportEventsAsJSON(currentMonthEvents);
      mimeType = 'application/json';
      fileExtension = 'json';
    } else {
      content = exportEventsAsCSV(currentMonthEvents);
      mimeType = 'text/csv';
      fileExtension = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `events_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="w-full max-w-md mx-auto bg-card text-card-foreground rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4 border-b">
        <Button onClick={goToPreviousMonth} variant="ghost" size="icon" aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <Button onClick={goToNextMonth} variant="ghost" size="icon" aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-center font-medium text-sm py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isWeekend = day.getDay() === 0 || day.getDay() === 6
            const dayEvents = getEventsForDate(events, day)

            return (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "h-10 w-10 p-0 font-normal aria-selected:opacity-100 relative",
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                  isToday && "bg-accent text-accent-foreground",
                  isSelected && "bg-primary text-primary-foreground",
                  isWeekend && "text-destructive",
                  !isCurrentMonth && "opacity-50"
                )}
                onClick={() => handleDateClick(day)}
              >
                <time dateTime={day.toISOString()}>{day.getDate()}</time>
                {dayEvents.length > 0 && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Button>
            )
          })}
        </div>
      </div>
      {selectedDate && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedEvent(undefined)
          }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          event={selectedEvent}
          date={selectedDate}
        />
      )}
      <div className='flex  gap-1 p-1'>

      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full ">View Events</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Events</SheetTitle>
          </SheetHeader>
          <EventList
            events={events}
            onEditEvent={handleEditEvent}
          />
        </SheetContent>
      </Sheet>
      <Select onValueChange={handleExport}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Export Events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">Export as JSON</SelectItem>
            <SelectItem value="csv">Export as CSV</SelectItem>
          </SelectContent>
        </Select>
        </div>
    </div>
  )
}

