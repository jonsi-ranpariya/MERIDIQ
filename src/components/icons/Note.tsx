import * as React from "react"
import { SVGProps } from "react"

const NoteIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width="1em"
        height="1em"
        viewBox="0 0 25 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect
            x={0.162109}
            y={0.388672}
            width={19.2176}
            height={20.9971}
            rx={5}
            fill="#E5E9F1"
        />
        <path
            d="M14 12.7065L23.156 3"
            stroke="#A1ACB8"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default NoteIcon
