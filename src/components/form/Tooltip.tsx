import React, { useState } from "react";

const Tooltip = (props: any) => {
    let timeout: any;
    const [active, setActive] = useState(false);

    const showTip = () => {
        timeout = setTimeout(() => {
            setActive(true);
        }, props.delay || 400);
    };

    const hideTip = () => {
        clearInterval(timeout);
        setActive(false);
    };
    return (
        <div
            className="inline-block relative"
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
        >
            {props.children}
            {active && (
                <div className={`absolute -left-20   p-1 -translate-y-6 text-black bg-white text-sm rounded-xl  -top-1 font-sans leading-none z-50 whitespace-nowrap`}>
                    {props.content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
