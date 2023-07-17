import { SVGProps } from "react"

interface SortIconProps extends SVGProps<SVGSVGElement> {
  sort?: "asc" | "desc" | "" | boolean
}

const SortIcon = ({ sort, ...props }: SortIconProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.59521 5.07742H10.3026C10.6116 5.07742 10.7225 4.72922 10.5411 4.52095C10.3228 4.27198 10.1053 4.02302 9.88778 3.77405C9.67032 3.52512 9.45285 3.27619 9.23455 3.02725C8.88689 2.63021 8.54007 2.23316 8.19325 1.83611C7.84649 1.43912 7.49972 1.04214 7.15212 0.645153C7.0129 0.487785 6.87619 0.330418 6.73765 0.170956C6.71576 0.145754 6.69382 0.120501 6.67182 0.0951864C6.56098 -0.0317288 6.30571 -0.0317288 6.19823 0.0951864C5.97991 0.344143 5.76242 0.5931 5.54493 0.842057C5.32746 1.091 5.10999 1.33994 4.89168 1.58888C4.54404 1.9859 4.19725 2.38292 3.85045 2.77994C3.50366 3.17696 3.15688 3.57397 2.80925 3.97098C2.67005 4.12833 2.53335 4.28568 2.39484 4.44512C2.37292 4.47034 2.35097 4.49561 2.32894 4.52095C2.21139 4.65437 2.19459 4.84963 2.32894 4.9798C2.34063 4.99212 2.35362 5.00339 2.36765 5.01354C2.41159 5.04722 2.4674 5.06998 2.5351 5.0759C2.55507 5.07804 2.57522 5.07858 2.59521 5.07742Z"
      className={sort === 'asc' ? 'fill-primary dark:fill-primaryLight' : "fill-mediumGray dark:fill-gray-600"}
    />
    <path
      d="M2.98011 8.22589C2.76263 7.97694 2.54514 7.72798 2.32682 7.47902C2.20926 7.3456 2.18911 7.15034 2.32346 7.01692C2.3495 6.99169 2.38085 6.97113 2.41517 6.95575C2.45822 6.93472 2.50938 6.92255 2.56865 6.92255H10.3005C10.6095 6.92255 10.7204 7.27075 10.539 7.47902C10.517 7.50437 10.495 7.52966 10.4731 7.55489C10.3346 7.71432 10.1979 7.87166 10.0587 8.02899C9.71108 8.42598 9.36431 8.82297 9.01755 9.21996C8.67073 9.61701 8.32391 10.0141 7.97626 10.4111C7.75794 10.6601 7.54046 10.909 7.32298 11.158C7.1055 11.4069 6.88802 11.6559 6.6697 11.9048C6.56222 12.0317 6.30695 12.0317 6.19611 11.9048C6.17409 11.8795 6.15213 11.8542 6.13022 11.829C5.99171 11.6695 5.85501 11.5122 5.71581 11.3548C5.36816 10.9578 5.02135 10.5608 4.67454 10.1637C4.32777 9.76673 3.98099 9.36973 3.63338 8.97273C3.41506 8.72378 3.19759 8.47484 2.98011 8.22589Z"
      className={sort === 'desc' ? 'fill-primary dark:fill-primaryLight' : "fill-mediumGray dark:fill-gray-600"}
    />
  </svg>
)

export default SortIcon
