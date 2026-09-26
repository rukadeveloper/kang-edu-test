// 상위 dashboard/loading.tsx는 /dashboard로 들어올 때만 쓰인다.
// /dashboard/reports/* 사이를 이동할 때도 헤더(layout)를 먼저 보여주고 본문만 기다리도록 이 구간에 따로 둔다
export default function Loading() {
    return (
        <div className="flex-1 flex justify-center items-center">로딩 중입니다...</div>
    )
}
