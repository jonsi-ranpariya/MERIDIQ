import { SVGProps } from "react"

const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 18 18"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 8.25C0 12.7987 3.70125 16.5 8.25 16.5C10.2545 16.5 12.0945 15.7812 13.5256 14.5879L16.718 17.7803C16.8642 17.9265 17.0562 18 17.2482 18C17.4402 18 17.6322 17.9265 17.7785 17.7803C18.0717 17.487 18.0717 17.013 17.7785 16.7198L14.5866 13.5272C15.7807 12.0958 16.5 10.2553 16.5 8.25C16.5 3.70125 12.7987 0 8.25 0C3.70125 0 0 3.70125 0 8.25ZM1.5 8.25C1.5 4.52775 4.5285 1.5 8.25 1.5C11.9715 1.5 15 4.52775 15 8.25C15 11.9722 11.9715 15 8.25 15C4.5285 15 1.5 11.9722 1.5 8.25Z"
    />
  </svg>
)

export default SearchIcon
