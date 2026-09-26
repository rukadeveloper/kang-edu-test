import { Suspense } from "react";
import AsideMenuLayout, { AsideMenuSkeleton } from "./AsideMenuLayout";

export default function DashboardLayout({ children } : { children: React.ReactNode }) {
    return (
        <>
          {/* loading.tsx는 page만 감싸므로 layout의 async 컴포넌트는 직접 Suspense로 감싼다 */}
          <Suspense fallback={<AsideMenuSkeleton />}>
            <AsideMenuLayout />
          </Suspense>
          { children }
        </>
    )
}
