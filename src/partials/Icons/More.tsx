import * as React from "react"
interface SVGRProps {
    direction?: 'vertical' | 'horizontal';
}

function MoreIcon({
    direction = 'horizontal',
    ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="prefix__css-i6dzq1"
            {...props}
        >
            {
                direction === 'horizontal'
                    ? (
                        <>
                            <circle cx={12} cy={12} r={1} />
                            <circle cx={19} cy={12} r={1} />
                            <circle cx={5} cy={12} r={1} />
                        </>
                    )
                    : <>
                        <circle cx={12} cy={12} r={1} />
                        <circle cx={12} cy={5} r={1} />
                        <circle cx={12} cy={19} r={1} />
                    </>
            }
        </svg>
    )
}

export default MoreIcon
