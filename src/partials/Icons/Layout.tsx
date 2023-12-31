import * as React from "react"

function LayoutIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
            <line x1={3} y1={9} x2={21} y2={9} />
            <line x1={9} y1={21} x2={9} y2={9} />
        </svg>
    )
}

export default LayoutIcon
