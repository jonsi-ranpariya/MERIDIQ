import * as React from "react"

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="thumbtack"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="svg-inline--fa fa-thumbtack fa-w-12 fa-9x"
            width="1em"
            height="1em"
            {...props}
        >
            <path
                fill="currentColor"
                d="M306.5 186.6l-5.7-42.6H328c13.2 0 24-10.8 24-24V24c0-13.2-10.8-24-24-24H56C42.8 0 32 10.8 32 24v96c0 13.2 10.8 24 24 24h27.2l-5.7 42.6C29.6 219.4 0 270.7 0 328c0 13.2 10.8 24 24 24h144v104c0 .9.1 1.7.4 2.5l16 48c2.4 7.3 12.8 7.3 15.2 0l16-48c.3-.8.4-1.7.4-2.5V352h144c13.2 0 24-10.8 24-24 0-57.3-29.6-108.6-77.5-141.4zM50.5 304c8.3-38.5 35.6-70 71.5-87.8L138 96H80V48h224v48h-58l16 120.2c35.8 17.8 63.2 49.4 71.5 87.8z"
                className=""
            />
        </svg>
    )
}

export default PinIcon
