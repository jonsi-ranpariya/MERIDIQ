import * as React from "react"
import { SVGProps } from "react"

const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 18 22"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 3V15C5 15.5304 5.21071 16.0391 5.58579 16.4142C5.96086 16.7893 6.46957 17 7 17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V6.242C17 5.97556 16.9467 5.71181 16.8433 5.46624C16.7399 5.22068 16.5885 4.99824 16.398 4.812L13.083 1.57C12.7094 1.20466 12.2076 1.00007 11.685 1H7C6.46957 1 5.96086 1.21071 5.58579 1.58579C5.21071 1.96086 5 2.46957 5 3V3Z"

      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 17V19C13 19.5304 12.7893 20.0391 12.4142 20.4142C12.0391 20.7893 11.5304 21 11 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H5"

      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default CopyIcon
