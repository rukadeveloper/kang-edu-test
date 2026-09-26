// hidden input은 required 검사를 받지 않으므로, 트리거 아래에 보이지 않는 input을 깔아
// 브라우저 기본 검사(제출 막기 + 안내 말풍선)를 그대로 쓴다. 포커스가 오면 트리거로 넘긴다.
export default function RequiredGuard({ value, onFocus }: { value: string, onFocus: () => void }) {
    return (
        <input
            tabIndex={-1}
            aria-hidden="true"
            required
            value={value}
            onChange={() => {}}
            onFocus={onFocus}
            className="absolute bottom-0 left-1/2 w-px h-px opacity-0 pointer-events-none"
        />
    )
}
