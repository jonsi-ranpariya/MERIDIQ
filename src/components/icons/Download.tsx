import { SVGProps } from "react"

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.5 12.75L1.96575 14.6138C2.04686 14.9383 2.23412 15.2263 2.49775 15.4322C2.76138 15.6381 3.08626 15.7499 3.42075 15.75H14.5792C14.9137 15.7499 15.2386 15.6381 15.5023 15.4322C15.7659 15.2263 15.9531 14.9383 16.0342 14.6138L16.5 12.75M9 11.25V2.25V11.25ZM9 11.25L6 8.25L9 11.25ZM9 11.25L12 8.25L9 11.25Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgComponent
