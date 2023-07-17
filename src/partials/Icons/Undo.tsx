import * as React from "react"

function UndoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14.009 14"
      fill="currentColor"
      {...props}
    >
      <path d="M5.9,6.231H.333A.333.333,0,0,1,0,5.9V.333A.333.333,0,0,1,.333,0H1.667A.333.333,0,0,1,2,.333V2.5a6.889,6.889,0,1,1,.5,9.713.334.334,0,0,1-.013-.484l.944-.944a.333.333,0,0,1,.456-.015,4.889,4.889,0,1,0-.713-6.543H5.9a.333.333,0,0,1,.333.333V5.9a.333.333,0,0,1-.333.333Z" />
    </svg>
  )
}

export default UndoIcon
