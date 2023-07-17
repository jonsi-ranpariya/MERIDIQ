import * as React from "react"


interface SVGRProps {
    sort?: 'asc' | 'desc' | ''
}

function SortIcon({ sort = '', ...props }: React.SVGProps<SVGSVGElement> & SVGRProps) {

    function returnSortIcon() {
        if (!sort) return <path fill="currentColor" stroke="none" d="M12,6L7,11H17L12,6M7,13L12,18L17,13H7Z" />
        if (sort === 'asc') return <path fill="currentColor" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        if (sort === 'desc') return <path fill="currentColor" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
    }

    return (
        <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            {...props}
        >
            {returnSortIcon()}
        </svg>
    )
}

export default SortIcon
