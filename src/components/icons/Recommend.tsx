import * as React from "react"
import { SVGProps } from "react"

const RecommendIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 12V20.409C22 21.0115 21.5525 21.5 21 21.5H3C2.4475 21.5 2 21.0115 2 20.409V12L12 18.5L22 12Z"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    <path
      d="M22 11.892L17 8.44604M2 11.892L7 8.44604L2 11.892Z"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 2.5H7V14.7075C6.99999 14.8741 7.0416 15.0381 7.12107 15.1845C7.20053 15.3309 7.31531 15.4552 7.455 15.546L11.455 18.146C11.6172 18.2514 11.8065 18.3076 12 18.3076C12.1935 18.3076 12.3828 18.2514 12.545 18.146L16.545 15.546C16.6847 15.4552 16.7995 15.3309 16.8789 15.1845C16.9584 15.0381 17 14.8741 17 14.7075V2.5Z"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    <path
      d="M10 9.5H14M10 6.5H12H10Z"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default RecommendIcon
