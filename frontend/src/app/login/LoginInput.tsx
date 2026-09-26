export default function LoginInput({ divId, name, type, placeholder }: { divId: string, name: string, type: string, placeholder: string }) {
    return (
        <div className={`${divId} flex flex-col gap-[10px] mb-5`}>
            <label htmlFor={divId} className="text-[13px]">이메일 또는 직원ID</label>
            <input type={type} name={name} placeholder={placeholder} className="bg-white p-4 focus:outline-none border border-[#b5d9f0]" />
        </div>
    )
}