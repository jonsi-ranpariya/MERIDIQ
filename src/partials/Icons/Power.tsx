import * as React from "react";
import useTheme from "../../hooks/useTheme";

interface PowerIconProps {
    slash?: boolean;
}

function PowerIcon({ slash, ...props }: React.SVGProps<SVGSVGElement> & PowerIconProps) {
    const { isDark } = useTheme();

    return (
        <div className="relative">
            <svg
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                {...props}
            >
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1={12} y1={2} x2={12} y2={12} />
                {slash
                    ? <>
                        <line x1={1} y1={19} x2={23} y2={7} stroke={isDark ? '#1c1b1a' : 'white'} strokeWidth="5" strokeLinecap="round"></line>
                        <line x1={1} y1={19} x2={23} y2={7} strokeLinecap="round"></line>
                    </>
                    : ''
                }
            </svg>
        </div >
    )
}

export default PowerIcon
