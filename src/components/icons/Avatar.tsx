import * as React from "react"
import { SVGProps } from "react"

const AvatarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
    role="img"
    width="1em"
    height="1em"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M17.754 14a2.249 2.249 0 0 1 2.249 2.25v.575c0 .894-.32 1.759-.901 2.438c-1.57 1.833-3.957 2.738-7.102 2.738c-3.146 0-5.532-.905-7.098-2.74a3.75 3.75 0 0 1-.899-2.434v-.578A2.249 2.249 0 0 1 6.253 14h11.501Zm0 1.5H6.252a.749.749 0 0 0-.749.75v.577c0 .535.192 1.053.54 1.46c1.253 1.469 3.219 2.214 5.957 2.214s4.706-.745 5.962-2.213a2.25 2.25 0 0 0 .54-1.463v-.576a.749.749 0 0 0-.748-.749ZM12 2.005a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Z"
    />
  </svg>
)

export default AvatarIcon