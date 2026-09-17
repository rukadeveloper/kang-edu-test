export default function LoadingIndicator({ label = "불러오는 중..." }: { label?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-[14px] py-[60px]">
            <div className="w-[36px] h-[36px] border-4 border-[#B5D9FD] border-t-[#5980A6] rounded-full animate-spin" />
            <p className="text-[14px] text-[#B2BBC5]">{label}</p>
        </div>
    )
}
