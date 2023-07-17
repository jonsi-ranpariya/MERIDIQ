import * as React from "react"

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
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
            className="css-i6dzq1"
            {...props}
        >
            <line x1={8} y1={6} x2={21} y2={6} />
            <line x1={8} y1={12} x2={21} y2={12} />
            <line x1={8} y1={18} x2={21} y2={18} />
            <line x1={3} y1={6} x2={3.01} y2={6} />
            <line x1={3} y1={12} x2={3.01} y2={12} />
            <line x1={3} y1={18} x2={3.01} y2={18} />
        </svg>
    )
}

export default ListIcon
