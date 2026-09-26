'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const menus = [
    { href: '/dashboard/reports/students', label: '보고서 확인하기' },
]

export default function StudentNav() {
    const pathname = usePathname()

    return (
        <nav className="mt-5">
            <h2 className="px-4 text-[14px] font-bold text-white">보고서</h2>
            <ul className="mt-5">
                {menus.map(({ href, label }) => {
                    // 하위 경로(/dashboard/reports/students/1 등)에서도 active 유지
                    const isActive = pathname === href || pathname.startsWith(`${href}/`)

                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`py-4 px-5 block text-xl font-bold rounded-md transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                            >
                                {label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
