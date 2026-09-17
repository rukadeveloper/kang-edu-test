export default function CommonInput({
    htmlFor,
    type,
    label,
    value,
    onChange,
    setIsTouched,
    isTouched,
    error,
    success,
}: {
    htmlFor: string;
    type: string
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setIsTouched: () => void;
    isTouched: boolean;
    error: string;
    success: string;
}) {
    return (
        <div className="common__input mt-[30px] flex flex-col">
            <label className="text-[14px]" htmlFor={htmlFor}>{label}</label>
            <input onFocus={setIsTouched} id={htmlFor} type={type} value={value} onChange={onChange} className="p-[10px] mt-[20px] bg-white outline-none border border-[#B5D9FD] text-[14px]" />
            {error && <p className="text-[12px] pt-[10px] text-red-500">{error}</p>}
            {success && <p className="text-[12px] pt-[10px] text-blue-500">{success}</p>}
        </div>
    )
}