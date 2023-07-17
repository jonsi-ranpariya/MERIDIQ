// Exported from Figma file
// bigTitle 30px
// headingTitle 24px
// subTitle 18px
// subHeader 16px
// normalText 14px
// smallFont 12px
// buttonFontStyle 14px

import { ReactNode } from "react"

export interface HeadingProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  variant?: "bigTitle" | "headingTitle" | "subTitle" | "subHeader"
  text: string | number | ReactNode
  count?: string | number
  children?: ReactNode
}

const Heading: React.FC<HeadingProps> = ({
  variant = "subTitle",
  text,
  count,
  children,
  className: propClassName,
  ...props
}) => {
  switch (variant) {
    case "bigTitle":
      return <h2 className={`text-2xl lg:text-3xl font-bold ${propClassName}`} {...props}>{text}{count ? <span className="text-gray-400 ml-2">({count})</span> : ''}</h2>
    case "headingTitle":
      return <h3 className={`text-2xl font-bold ${propClassName}`} {...props}>{text}{count ? <span className="text-gray-400 ml-2">({count})</span> : ''}</h3>
    case "subTitle":
      return <h4 className={`text-xl font-semibold ${propClassName}`} {...props}>{text}{count ? <span className="text-gray-400 ml-2">({count})</span> : ''}</h4>
    case "subHeader":
      return <h5 className={`text-lg font-semibold ${propClassName}`} {...props}>{text}{count ? <span className="text-gray-400 ml-2">({count})</span> : ''}</h5>
    default:
      return <p {...props}>{text}{count ? <span className="text-gray-400 ml-2">({count})</span> : ''}</p>
  }
}

export default Heading;