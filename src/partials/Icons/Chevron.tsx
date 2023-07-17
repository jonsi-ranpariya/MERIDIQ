import * as React from "react"

interface SVGRProps {
    side: 'top' | 'bottom' | 'right' | 'left'
}

function returnChevSideIcon(side: 'top' | 'bottom' | 'right' | 'left') {
    if (side === 'top') {
        return <polyline points="18 15 12 9 6 15" />
    }
    if (side === 'left') {
        return <polyline points="15 18 9 12 15 6" />
    }
    if (side === 'right') {
        return <polyline points="9 18 15 12 9 6" />
    }
    if (side === 'bottom') {
        return <polyline points="6 9 12 15 18 9" />
    }
}

function ChevronIcon({
    side,
    ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
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
            {returnChevSideIcon(side)}
        </svg>
    )
}

export default ChevronIcon
