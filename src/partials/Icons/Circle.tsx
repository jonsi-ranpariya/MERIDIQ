import * as React from "react"

function CircleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={24}
            height={24}
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx={12} cy={12} r={10} />
        </svg>
    )
}

export default CircleIcon
