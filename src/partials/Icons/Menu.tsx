import * as React from "react"

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 18"
            width="1em"
            height="1em"
            fill="currentColor"
            {...props}
        >
            <rect width="16" height="2" />
            <rect y="8" width="24" height="2" />
            <rect x="8" y="16" width="16" height="2" />
        </svg>
    )
}

export default MenuIcon
