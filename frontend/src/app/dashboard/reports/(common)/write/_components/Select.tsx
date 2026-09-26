'use client'

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { useCloseOnOutside } from "./useCloseOnOutside"
import RequiredGuard from "./RequiredGuard"

export interface SelectOption {
    value: string
    label: string
}

interface SelectProps {
    id: string
    name: string
    options: SelectOption[]
    placeholder: string
    defaultValue?: string
    required?: boolean
}

export default function Select({ id, name, options, placeholder, defaultValue = '', required = false }: SelectProps) {
    const [value, setValue] = useState(defaultValue)
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const rootRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const optionRefs = useRef<(HTMLLIElement | null)[]>([])
    const listboxId = useId()

    const selected = options.find((option) => option.value === value)
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

    // 키보드로 이동할 때 활성 항목이 목록 밖으로 나가지 않게 스크롤
    useEffect(() => {
        if (isOpen && activeIndex >= 0) optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }, [isOpen, activeIndex])

    function open() {
        setActiveIndex(Math.max(options.findIndex((option) => option.value === value), 0))
        setIsOpen(true)
    }

    function choose(index: number) {
        setValue(options[index].value)
        setIsOpen(false)
        triggerRef.current?.focus()
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (!isOpen) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault()
                open()
            }
            return
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                setActiveIndex((index) => Math.min(index + 1, options.length - 1))
                break
            case 'ArrowUp':
                event.preventDefault()
                setActiveIndex((index) => Math.max(index - 1, 0))
                break
            case 'Home':
                event.preventDefault()
                setActiveIndex(0)
                break
            case 'End':
                event.preventDefault()
                setActiveIndex(options.length - 1)
                break
            case 'Enter':
            case ' ':
                // 버튼 기본 클릭(열기/닫기 토글)이 함께 일어나지 않도록 막는다
                event.preventDefault()
                if (activeIndex >= 0) choose(activeIndex)
                break
            case 'Escape':
                event.preventDefault()
                close()
                break
            case 'Tab':
                close()
                break
        }
    }

    return (
        <div ref={rootRef} className="relative">
            <input type="hidden" name={name} value={value} />
            {required && <RequiredGuard value={value} onFocus={() => triggerRef.current?.focus()} />}

            <button
                ref={triggerRef}
                id={id}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-activedescendant={isOpen && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
                onClick={() => (isOpen ? close() : open())}
                onKeyDown={handleKeyDown}
                // 스페이스는 keyup에서 클릭이 발생하므로 열린 상태에서는 여기서도 막는다
                onKeyUp={(event) => { if (event.key === ' ') event.preventDefault() }}
                className={`w-full p-3 flex items-center justify-between gap-2 text-left bg-white border focus:outline-none ${isOpen ? 'border-[#5980A6]' : 'border-gray-300 focus:border-[#5980A6]'}`}
            >
                <span className={`truncate ${selected ? '' : 'text-gray-400'}`}>{selected?.label ?? placeholder}</span>
                <svg viewBox="0 0 20 20" aria-hidden="true" className={`w-4 h-4 shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isOpen && (
                <ul
                    id={listboxId}
                    role="listbox"
                    className="absolute z-10 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 shadow-lg"
                >
                    {options.length === 0 && <li className="p-3 text-gray-400">선택할 항목이 없습니다</li>}
                    {options.map((option, index) => {
                        const isSelected = option.value === value
                        const isActive = index === activeIndex

                        return (
                            <li
                                key={option.value}
                                ref={(element) => { optionRefs.current[index] = element }}
                                id={`${listboxId}-${index}`}
                                role="option"
                                aria-selected={isSelected}
                                // 목록을 누르는 순간 트리거의 포커스가 빠지지 않도록 막는다
                                onMouseDown={(event) => event.preventDefault()}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => choose(index)}
                                className={`p-3 cursor-pointer ${isActive ? 'bg-[#5980A6]/10' : ''} ${isSelected ? 'font-bold text-[#5980A6]' : ''}`}
                            >
                                {option.label}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
