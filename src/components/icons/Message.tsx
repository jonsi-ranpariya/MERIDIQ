import * as React from "react"
import { SVGProps } from "react"

const MessageIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width="1em"
        height="1em"
        viewBox="0 0 22 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.6471 6.66699H12.6863C10.8345 6.66699 9.33333 8.1589 9.33333 9.99925V11.623C9.33333 13.4634 10.8345 14.9553 12.6863 14.9553H18.9793L20.9055 16.5169C21.1925 16.7496 21.6149 16.707 21.849 16.4218C21.9467 16.3028 22 16.154 22 16.0005V9.99925C22 8.1589 20.4988 6.66699 18.6471 6.66699Z"
            fill="#BDC5CD"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.72032 0H15.613C18.22 0 20.3333 2.13615 20.3333 4.77123V9.05931C20.3333 11.6944 18.22 13.8305 15.613 13.8305H4.84904L1.78688 16.4112C1.32482 16.8007 0.637925 16.7377 0.252663 16.2707C0.0894101 16.0728 0 15.8233 0 15.5656V4.77123C0 2.13615 2.11336 0 4.72032 0Z"
            fill="#EDF0F5"
        />
    </svg>
)

export default MessageIcon
