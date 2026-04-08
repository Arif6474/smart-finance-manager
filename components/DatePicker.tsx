'use client';

import { useState, useRef, useEffect } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
    value: string; // yyyy-MM-dd or ISO
    onChange: (date: string) => void;
    placeholder?: string;
    showTime?: boolean;
}

export default function DatePicker({ value, onChange, placeholder = 'Select date', showTime = false }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedDate = value ? new Date(value) : null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const handleDateClick = (date: Date) => {
        if (showTime) {
            // If showTime is true, we preserve the current time from the 'value' or default to now
            const base = value ? new Date(value) : new Date();
            date.setHours(base.getHours());
            date.setMinutes(base.getMinutes());
            onChange(date.toISOString());
        } else {
            onChange(format(date, 'yyyy-MM-dd'));
            setIsOpen(false);
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        const base = selectedDate || new Date();
        base.setHours(hours);
        base.setMinutes(minutes);
        onChange(base.toISOString());
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full input-field flex items-center gap-3 text-left focus:ring-2 focus:ring-primary/20 transition-all bg-white dark:bg-slate-900/50 backdrop-blur-md"
            >
                <CalendarIcon size={18} className={selectedDate ? 'text-primary' : 'text-muted-foreground'} />
                <span className={selectedDate ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                    {selectedDate ? format(selectedDate, 'PPP') : placeholder}
                </span>
                {selectedDate && (
                    <X
                        size={14}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange('');
                        }}
                    />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[120] top-full mt-3 left-0 w-[320px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-border overflow-hidden p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-lg">
                                {format(currentMonth, 'MMMM yyyy')}
                            </h4>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={prevMonth}
                                    className="p-2 hover:bg-muted rounded-xl transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="p-2 hover:bg-muted rounded-xl transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Weekdays */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, idx) => {
                                const isSelected = selectedDate && isSameDay(day, selectedDate);
                                const isCurrentMonth = isSameMonth(day, currentMonth);
                                const isTodayDate = isToday(day);

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleDateClick(day)}
                                        className={`
                                            relative h-10 w-full flex items-center justify-center rounded-xl text-sm font-medium transition-all
                                            ${!isCurrentMonth ? 'text-muted-foreground/20' : 'text-foreground'}
                                            ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/25 z-10 scale-110' : 'hover:bg-muted'}
                                            ${isTodayDate && !isSelected ? 'text-primary ring-1 ring-primary/30' : ''}
                                        `}
                                    >
                                        {format(day, 'd')}
                                        {isTodayDate && !isSelected && (
                                            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Quick Presets & Time Footer */}
                        <div className="mt-6 pt-6 border-t border-border space-y-4">
                            {showTime && (
                                <div className="flex items-center justify-between gap-4 px-1">
                                    <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <Clock size={14} /> Time
                                    </span>
                                    <input
                                        type="time"
                                        value={selectedDate ? format(selectedDate, 'HH:mm') : '12:00'}
                                        onChange={handleTimeChange}
                                        className="bg-muted border border-border px-3 py-1.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDateClick(new Date())}
                                    className="text-xs font-bold py-2.5 px-3 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-all"
                                >
                                    Today
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDateClick(addDays(new Date(), 1))}
                                    className="text-xs font-bold py-2.5 px-3 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-all"
                                >
                                    Tomorrow
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
