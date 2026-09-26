'use client'

import { useCallback, useEffect, useRef, useState } from "react"
import { useCloseOnOutside } from "./useCloseOnOutside"
import RequiredGuard from "./RequiredGuard"

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

// 폼에는 input[type=date]와 같은 YYYY-MM-DD 형식으로 보낸다
function toKey(date: Date) {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${date.getFullYear()}-${month}-${day}`
}

function fromKey(key: string) {
    const [year, month, day] = key.split('-').map(Number)
    return new Date(year, month - 1, day)
}

function addDays(date: Date, amount: number) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

function addMonths(date: Date, amount: number) {
    // 1월 31일 → 2월처럼 없는 날짜가 되면 그 달의 마지막 날로 맞춘다
    const lastDay = new Date(date.getFullYear(), date.getMonth() + amount + 1, 0).getDate()
    return new Date(date.getFullYear(), date.getMonth() + amount, Math.min(date.getDate(), lastDay))
}

function formatLabel(date: Date) {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`
}

// 달력은 항상 6주(42칸)로 그려서 달이 바뀌어도 높이가 흔들리지 않게 한다
function getCalendarDays(viewMonth: Date) {
    const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
    const start = addDays(firstOfMonth, -firstOfMonth.getDay())
    return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}

interface DatePickerProps {
    id: string
    name: string
    placeholder: string
    defaultValue?: string
    required?: boolean
}

export default function DatePicker({ id, name, placeholder, defaultValue = '', required = false }: DatePickerProps) {
    const [value, setValue] = useState(defaultValue)
    const [isOpen, setIsOpen] = useState(false)
    // 키보드로 옮겨 다니는 날짜. 보이는 달도 이 날짜를 따라간다
    const [focusedDate, setFocusedDate] = useState<Date | null>(null)
    // 오늘 날짜는 서버 렌더와 어긋나지 않도록 달력을 열 때 계산한다
    const [today, setToday] = useState<Date | null>(null)
    const rootRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    const close = useCallback(() => setIsOpen(false), [])

    useCloseOnOutside(rootRef, isOpen, close)

    // 폼이 초기화(reset)되면 처음 값으로 되돌린다. hidden input은 React 상태가 값을 쥐고 있어 직접 맞춰야 한다
    useEffect(() => {
        const form = rootRef.current?.closest('form')
        if (!form) return

        function handleReset() {
            setValue(defaultValue)
            setIsOpen(false)
        }

        form.addEventListener('reset', handleReset)
        return () => form.removeEventListener('reset', handleReset)
    }, [defaultValue])

    // 열리거나 날짜를 옮기면 해당 날짜 칸으로 포커스를 옮긴다
    useEffect(() => {
        if (!isOpen || !focusedDate) return
        gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${toKey(focusedDate)}"]`)?.focus()
    }, [isOpen, focusedDate])

    function open() {
        const now = new Date()
        setToday(now)
        setFocusedDate(value ? fromKey(value) : now)
        setIsOpen(true)
    }

    function closeAndReturnFocus() {
        setIsOpen(false)
        triggerRef.current?.focus()
    }

    function choose(date: Date) {
        setValue(toKey(date))
        closeAndReturnFocus()
    }

    function handleGridKeyDown(event: React.KeyboardEvent) {
        if (!focusedDate) return

        const moves: Record<string, () => Date> = {
            ArrowLeft: () => addDays(focusedDate, -1),
            ArrowRight: () => addDays(focusedDate, 1),
            ArrowUp: () => addDays(focusedDate, -7),
            ArrowDown: () => addDays(focusedDate, 7),
            Home: () => addDays(focusedDate, -focusedDate.getDay()),
            End: () => addDays(focusedDate, 6 - focusedDate.getDay()),
            PageUp: () => addMonths(focusedDate, -1),
            PageDown: () => addMonths(focusedDate, 1),
        }

        if (moves[event.key]) {
            event.preventDefault()
            setFocusedDate(moves[event.key]())
        }
    }

    const viewMonth = focusedDate ?? today
    const selectedDate = value ? fromKey(value) : null

    return (
        <div
            ref={rootRef}
            className="relative"
            onKeyDown={(event) => { if (isOpen && event.key === 'Escape') { event.preventDefault(); closeAndReturnFocus() } }}
        >
            <input type="hidden" name={name} value={value} />
            {required && <RequiredGuard value={value} onFocus={() => triggerRef.current?.focus()} />}

            <button
                ref={triggerRef}
                id={id}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                onClick={() => (isOpen ? close() : open())}
                className={`w-full p-3 flex items-center justify-between gap-2 text-left bg-white border focus:outline-none ${isOpen ? 'border-[#5980A6]' : 'border-gray-300 focus:border-[#5980A6]'}`}
            >
                <span className={selectedDate ? '' : 'text-gray-400'}>{selectedDate ? formatLabel(selectedDate) : placeholder}</span>
                <svg viewBox="0 0 20 20" aria-hidden="true" className="w-4 h-4 shrink-0 text-gray-500">
                    <rect x="3" y="4.5" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M3 8.5h14M7 2.5v4M13 2.5v4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
            </button>

            {isOpen && viewMonth && (
                <div role="dialog" aria-label="날짜 선택" className="absolute z-10 left-0 mt-1 w-[300px] p-4 bg-white border border-gray-300 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            aria-label="이전 달"
                            onClick={() => setFocusedDate(addMonths(viewMonth, -1))}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                        >
                            ‹
                        </button>
                        <strong aria-live="polite">{viewMonth.getFullYear()}년 {viewMonth.getMonth() + 1}월</strong>
                        <button
                            type="button"
                            aria-label="다음 달"
                            onClick={() => setFocusedDate(addMonths(viewMonth, 1))}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                        >
                            ›
                        </button>
                    </div>

                    <div className="grid grid-cols-7 mb-1 text-center text-[13px] text-gray-500">
                        {weekdays.map((weekday, index) => (
                            <span key={weekday} className={index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : ''}>{weekday}</span>
                        ))}
                    </div>

                    <div ref={gridRef} role="grid" onKeyDown={handleGridKeyDown} className="grid grid-cols-7 gap-1">
                        {getCalendarDays(viewMonth).map((date) => {
                            const key = toKey(date)
                            const isCurrentMonth = date.getMonth() === viewMonth.getMonth()
                            const isSelected = selectedDate !== null && key === toKey(selectedDate)
                            const isToday = today !== null && key === toKey(today)
                            const isFocused = focusedDate !== null && key === toKey(focusedDate)

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    role="gridcell"
                                    data-date={key}
                                    // 달력 안에서는 방향키로 이동하고, Tab은 한 칸에만 멈춘다
                                    tabIndex={isFocused ? 0 : -1}
                                    aria-selected={isSelected}
                                    aria-current={isToday ? 'date' : undefined}
                                    onClick={() => choose(date)}
                                    className={`h-9 rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-[#5980A6]/40
                                        ${isSelected ? 'bg-[#5980A6] text-white font-bold' : 'hover:bg-gray-100'}
                                        ${!isSelected && !isCurrentMonth ? 'text-gray-300' : ''}
                                        ${!isSelected && isToday ? 'border border-[#5980A6] text-[#5980A6] font-bold' : ''}`}
                                >
                                    {date.getDate()}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex justify-end mt-3">
                        <button
                            type="button"
                            onClick={() => today && choose(today)}
                            className="text-[13px] text-[#5980A6] font-bold hover:underline"
                        >
                            오늘
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
