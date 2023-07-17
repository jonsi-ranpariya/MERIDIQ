import { SVGProps } from "react"

const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    fill="currentColor"
    stroke="currentColor"
  >
    <path
      d="M10.97 1.893a1.5 1.5 0 0 1 2.06 0l7.267 6.868c.45.425.703 1.017.703 1.636v8.354a2.25 2.25 0 0 1-2.25 2.25h-3a2.251 2.251 0 0 1-2.25-2.251V15a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v3.75A2.25 2.25 0 0 1 8.25 21h-3A2.25 2.25 0 0 1 3 18.75v-8.355c0-.618.255-1.21.705-1.635l7.264-6.87v.003ZM12 2.982l-7.266 6.87a.75.75 0 0 0-.234.543v8.355a.75.75 0 0 0 .75.75h3a.75.75 0 0 0 .75-.75V15a2.25 2.25 0 0 1 2.25-2.25h1.5A2.25 2.25 0 0 1 15 15v3.75a.75.75 0 0 0 .75.75h3a.75.75 0 0 0 .75-.75v-8.355a.752.752 0 0 0-.234-.545L12 2.982Z"
      strokeWidth={0.2}
    />
  </svg>
)

export default HomeIcon
