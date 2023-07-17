import * as React from "react"

function UserPlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx={8.5} cy={7} r={4} />
            <line x1={20} y1={8} x2={20} y2={14} />
            <line x1={23} y1={11} x2={17} y2={11} />
        </svg>
    )
}

export default UserPlusIcon
