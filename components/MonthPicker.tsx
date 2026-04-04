'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MonthPickerProps {
    monthOffset: number;
    onChange: (offset: number) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function MonthPicker({ monthOffset, onChange }: MonthPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate currently selected date based on offset
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + monthOffset);

    // Popup state
    const [popupYear, setPopupYear] = useState(currentDate.getFullYear());

    useEffect(() => {
        if (isOpen) {
            setPopupYear(currentDate.getFullYear());
        }
    }, [isOpen, currentDate.getFullYear()]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMonthSelect = (monthIndex: number) => {
        // Calculate new offset from current real date
        const now = new Date();
        const selectedDate = new Date(popupYear, monthIndex, 1);

        // Difference in months = (selectedYear - currentYear) * 12 + (selectedMonth - currentMonth)
        const diff = (popupYear - now.getFullYear()) * 12 + (monthIndex - now.getMonth());

        onChange(diff);
        setIsOpen(false);
    };

    const monthDisplay = MONTHS[currentDate.getMonth()] + ' ' + currentDate.getFullYear();

    return (
        <div className="flex items-center gap-1 relative" ref={containerRef}>
            <button
                onClick={() => onChange(monthOffset - 1)}
                className="p-1.5 border border-border hover:bg-muted rounded-lg text-muted-foreground transition-colors"
            >
                <ChevronLeft size={18} />
            </button>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-1.5 border border-border hover:border-primary/50 rounded-lg text-foreground font-medium transition-all focus:ring-2 focus:ring-primary/20"
            >
                <span>{monthDisplay}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} className="text-muted-foreground" />
                </motion.div>
            </button>

            <button
                onClick={() => onChange(monthOffset + 1)}
                className="p-1.5 border border-border hover:bg-muted rounded-lg text-muted-foreground transition-colors"
            >
                <ChevronRight size={18} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-full -left-[5%] -translate-x-1/2 mt-2 p-3 w-64 z-50 bg-card border border-border rounded-2xl shadow-xl"
                    >
                        {/* Year Header */}
                        <div className="flex items-center justify-between mb-4 px-1">
                            <button
                                onClick={() => setPopupYear(y => y - 1)}
                                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="font-bold text-foreground tracking-wider">{popupYear}</span>
                            <button
                                onClick={() => setPopupYear(y => y + 1)}
                                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Months Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {MONTHS.map((month, index) => {
                                const isSelected = currentDate.getMonth() === index && currentDate.getFullYear() === popupYear;
                                return (
                                    <button
                                        key={month}
                                        onClick={() => handleMonthSelect(index)}
                                        className={`py-2 rounded-xl text-sm font-medium transition-all ${isSelected
                                            ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        {month}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
