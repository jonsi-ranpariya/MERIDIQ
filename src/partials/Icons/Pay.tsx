import * as React from "react"

function PayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            data-prefix="fas"
            data-icon="credit-card"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            className="svg-inline--fa fa-credit-card fa-w-18 fa-7x"
            {...props}
        >
            <path
                fill="currentColor"
                d="M0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V256H0v176zm192-68c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H204c-6.6 0-12-5.4-12-12v-40zm-128 0c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM576 80v48H0V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48z"
            />
        </svg>
    )
}

export default PayIcon
