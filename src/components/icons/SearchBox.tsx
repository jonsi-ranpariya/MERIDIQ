import * as React from "react"
import { SVGProps } from "react"

const SearchBoxIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width="1em"
        height="1em"
        viewBox="0 0 22 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect width={20.1356} height={22} rx={5} fill="#EDF0F5" />
        <path
            d="M17.2031 19.3218L20.1862 22.6777"
            stroke="#BDC5CD"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <ellipse
            cx={13.8475}
            cy={14.8475}
            rx={4.84746}
            ry={4.84746}
            stroke="#BDC5CD"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default SearchBoxIcon
