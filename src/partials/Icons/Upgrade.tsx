import * as React from "react"

function UpgradeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 20 24"
            stroke="currentColor"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M19 13V21C19 21.5304 18.7893 22.0391 18.4142 22.4142C18.0391 22.7893 17.5304 23 17 23H3C2.46957 23 1.96086 22.7893 1.58579 22.4142C1.21071 22.0391 1 21.5304 1 21V13" />
            <path d="M15 6L10 1L5 6" />
            <path d="M10 1V16" />
        </svg>
    )
}

export default UpgradeIcon
