import React from "react";
import { CanvasShape } from "../../components/Clients/Client/Procedures/create/ClientProcedureCreate";
import CanvasDrawBoard from './index';
// import CanvasDrawBoard from './index_new';
// import CanvasDrawBoard from 'react-canvas-draw';

export interface CanvasDrawProps {
    canvasHeight?: number;
    image?: string;
    saveData?: string;
    color?: string;
    disabled?: boolean;
    shape?: CanvasShape;
    className?: string,
    text?: string,
    brushRadius?: number,
    onChange?: () => void,
}

const CanvasDraw = React.forwardRef<CanvasDrawBoard, CanvasDrawProps>(({
    canvasHeight = 720,
    image = '',
    saveData,
    color = '#000',
    disabled = false,
    className = '',
    onChange = () => {},
    shape = 'pen',
    brushRadius = 2,
    text = '',
}: CanvasDrawProps, ref) => {
    console.log("canvas wrapper rerendered: ");

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CanvasDrawBoard
                // @ts-ignore
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'none'
                }}
                // shape={shape}
                shape={shape}
                text={text}
                saveData={saveData || undefined}
                onChange={onChange}
                immediateLoading
                className={`${className} cursor-draw rounded`}
                disabled={disabled}
                brushColor={color}
                ref={ref}
                canvasWidth="100%"
                canvasHeight={`${canvasHeight}px`}
                hideGrid
                hideInterface
                lazyRadius={brushRadius}
                brushRadius={brushRadius}
                imgSrc={image || undefined}
            />
        </div>
    );
});

export default CanvasDraw;