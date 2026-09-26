import { RefObject, useEffect } from "react"

// 열려 있는 동안 영역 바깥을 누르면 닫는다
export function useCloseOnOutside(ref: RefObject<HTMLElement | null>, isOpen: boolean, close: () => void) {
    useEffect(() => {
        if (!isOpen) return

        function handlePointerDown(event: PointerEvent) {
            if (!ref.current?.contains(event.target as Node)) close()
        }

        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [ref, isOpen, close])
}
