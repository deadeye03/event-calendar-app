"use client"
import React, { useEffect, useState } from 'react';
import { Event } from '@/lib/utils/date';
import { Button } from "@/components/ui/button";
import { Input } from './ui/input';

interface EventListProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
}

export function EventList({ events, onEditEvent }: EventListProps) {
  const[search,setSearch]=useState('')
  const[fileterEvents,setFilterEvents]=useState(events);
  useEffect(()=>{
    if (search) {
      const filtered=events.filter(event=>event.name.toLowerCase().includes(search.toLowerCase()) || event.description?.toLowerCase().includes(search.toLowerCase()) )
      setFilterEvents(filtered)
    }
    else{
      setFilterEvents(events);
    }
  },[search,events,setFilterEvents])
  return (
    <div className="space-y-4">

      <Input className='' value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search events '/>

      {fileterEvents.map((event) => (
        <div key={event.id} className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <h3 className="font-semibold">{event.name}</h3>
          <p className="text-sm text-muted-foreground">
            {event.startTime} - {event.endTime}
          </p>
          {event.description && (
            <p className="mt-2 text-sm">{event.description}</p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditEvent(event)}
            className="mt-2"
          >
            Edit
          </Button>
        </div>
      ))}
    </div>
  );
}

