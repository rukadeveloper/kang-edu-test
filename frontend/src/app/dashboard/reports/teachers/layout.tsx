export default function TeacherReportsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="contents flex-1 flex flex-col bg-[#f2f2f3]">
            <div className="contentsHeader w-full flex items-center h-[100px] box-border p-6 bg-white border-b border-black">
                <h2 className="text-3xl font-bold">보고서 조회</h2>
            </div>
            {children}
        </div>
    )
}
