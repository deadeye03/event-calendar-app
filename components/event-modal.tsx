import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Event } from '@/lib/utils/date';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  onDelete: () => void;
  event?: Event;
  date: Date;
}

export function EventModal({ isOpen, onClose, onSave, onDelete, event, date }: EventModalProps) {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [error,setError]=useState('')
  useEffect(() => {
    if (event) {
      setName(event.name);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setDescription(event.description || '');
    } else {
      setName('');
      setStartTime('');
      setEndTime('');
      setDescription('');
    }
  }, [event]);

  const handleSave = () => {
    if (!name) {
        setError('Please Enter a name')
        return;
    }
    if(!startTime|| !endTime){
        setError('Please Enter Time')
        return;
    }
    if (startTime>endTime) {
        setError('Endtime should be smaller than start TIme')
        return
    }
    onSave({
      date: date.toISOString().split('T')[0],
      name,
      startTime,
      endTime,
      description,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-time" className="text-right">
              Start Time
            </Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-time" className="text-right">
              End Time
            </Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          {event && (
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          )}
        {error && <span className='text-xs text-red-500'>{error}</span> }
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

