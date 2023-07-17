import * as React from "react"

function PenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 19H19" />
      <path d="M14.5 2.50001C14.8978 2.10219 15.4374 1.87869 16 1.87869C16.2786 1.87869 16.5544 1.93356 16.8118 2.04017C17.0692 2.14677 17.303 2.30303 17.5 2.50001C17.697 2.697 17.8532 2.93085 17.9598 3.18822C18.0665 3.44559 18.1213 3.72144 18.1213 4.00001C18.1213 4.27859 18.0665 4.55444 17.9598 4.81181C17.8532 5.06918 17.697 5.30303 17.5 5.50001L5 18L1 19L2 15L14.5 2.50001Z" />
    </svg>
  )
}

export default PenIcon
