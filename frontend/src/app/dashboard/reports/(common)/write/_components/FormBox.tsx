interface TypeArray {
    id: number
    name: string
    htmlFor: string
    field: React.ReactNode
}

// Tailwind는 클래스 문자열을 정적으로 찾으므로 열 개수별 클래스를 그대로 적어 둔다
const columnClassNames = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
}

interface FormBoxProps {
    title: string
    typeArr: TypeArray[]
    columns?: 1 | 2
    className?: string
}

export default function FormBox({ title, typeArr, columns = 2, className = '' } : FormBoxProps) {
    return (
        <div className={`formBox shadow-sm bg-white box-border p-6 border-t-4 border-[#5980A6] ${className}`}>
            <h2 className="text-[#5980A6] pb-4 mb-5 text-[18px] font-bold border-b border-gray-200">{title}</h2>
            <ul className={`grid ${columnClassNames[columns]} gap-[8px]`}>
                {typeArr.map((type: TypeArray) => (
                    <li key={type.id} className="flex flex-col gap-2">
                        <label htmlFor={type.htmlFor} className="font-bold">{type.name}</label>
                        {type.field}
                    </li>
                ))}
            </ul>
        </div>
    )
}
