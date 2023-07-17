import * as React from "react"

function LogoSvgIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 367 367"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            strokeMiterlimit={10}
            stroke="currentColor"
            {...props}
        >
            <path
                d="M183.06 357.98C279.666 357.98 357.98 279.666 357.98 183.06C357.98 86.4543 279.666 8.14 183.06 8.14C86.4543 8.14 8.14 86.4543 8.14 183.06C8.14 279.666 86.4543 357.98 183.06 357.98Z"
                strokeWidth={16}
            />
            <path
                d="M220.25 322.16C275.738 322.16 320.72 277.178 320.72 221.69C320.72 166.202 275.738 121.22 220.25 121.22C164.762 121.22 119.78 166.202 119.78 221.69C119.78 277.178 164.762 322.16 220.25 322.16Z"
                strokeWidth={13}
            />
            <path
                d="M247.63 285.73C272.091 285.73 291.92 265.901 291.92 241.44C291.92 216.979 272.091 197.15 247.63 197.15C223.169 197.15 203.34 216.979 203.34 241.44C203.34 265.901 223.169 285.73 247.63 285.73Z"
                strokeWidth={10}
            />
        </svg>
    )
}

export default LogoSvgIcon
