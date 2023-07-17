import useDebounce from "@hooks/useDebounce";
import React, { memo, useEffect, useState } from "react";
import { CanvasShape } from "../../components/Clients/Client/Procedures/create/ClientProcedureCreate";
import useLocalStorage from "../../hooks/useLocalStorage";
import strings from "../../lang/Lang";
import TinyError from "../Error/TinyError";
import DeleteIcon from "../Icons/Delete";
import CircleIcon from "../Icons/editing/Circle";
import CircleFilledIcon from "../Icons/editing/CircleFilled";
import CircleGradientIcon from "../Icons/editing/CircleGradient";
import CrossIcon from "../Icons/editing/Cross";
import PenIcon from "../Icons/editing/Pen";
import UndoIcon from "../Icons/Undo";
import CanvasDraw from "./CanvasDraw";
import CanvasEditingButton from "./CanvasEditingButton";
import CanvasDrawDrawing from "./index";

export interface ClientProcedureDrawingProps {
    onChange?: () => void,
    show?: boolean,
    error?: boolean,
    helperText?: string | boolean,
    name?: string,
    question?: string,
    value?: string,
    saveData?: string,
    index?: number,
    text?: string,
    onUndo?: () => void,
    onClear?: () => void,
    onCircle?: () => void,
    onPen?: () => void,
    onCross?: () => void,
    onPenFat?: () => void,
    onCrossFat?: () => void,
    onFilledCircle?: () => void,
    onGradientCircle?: () => void,
    onText?: (text: string) => void,
    shape?: CanvasShape,
    brushRadius?: number,
}

const procedureCanvasDrawColors = [
    '#FDF854',
    '#57C031',
    '#EC4441',
    '#0066FF',
    '#AA43C8',
    '#000000',
];

const penSizes = [0.5, 1, 2, 3, 4, 5]

const ClientProcedureDrawing = React.forwardRef<CanvasDrawDrawing, ClientProcedureDrawingProps>(({
    onChange = () => {},
    error = false,
    helperText = '',
    name,
    index = 0,
    value,
    saveData,
    show = false,
    onUndo = () => {},
    onClear = () => {},
    onCircle = () => {},
    onPen = () => {},
    onCross = () => {},
    onPenFat = () => {},
    onCrossFat = () => {},
    onFilledCircle = () => {},
    onText = (text: string) => {},
    onGradientCircle = () => {},
    shape,
    brushRadius = 2,
    text = '',
}, canvasRef) => {
    const { storedValue: selectedColor, setStorageValue: setSelectedColor } = useLocalStorage('procedure_color', procedureCanvasDrawColors[3]);

    const { storedValue: brushSize, setStorageValue: setBrushSize } = useLocalStorage('procedure_canvas_pen_size', penSizes[brushRadius])


    const [windowScrollTop, setWindowScrollTop] = useState(0);
    const [canvasWrapper, setCanvasWrapper] = useState(true);
    const debouncescrollTop = useDebounce(windowScrollTop, 300);

    useEffect(() => {
        function scrollListener() {
            setWindowScrollTop(window.scrollY)
        }
        window.addEventListener('scroll', scrollListener);
        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, []);

    useEffect(() => {
        if (canvasWrapper) return
        setCanvasWrapper(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncescrollTop]);

    return (
        <>
            <div className="bg-white relative">
                <div className={`relative select-none w-full`}>
                    <div className="xl:px-10 z-1">
                        <CanvasDraw
                            ref={canvasRef}
                            className={`${show ? '' : 'visibility_hidden'} select-none rounded`}
                            image={value}
                            color={selectedColor || procedureCanvasDrawColors[3]}
                            disabled={!show}
                            canvasHeight={720}
                            saveData={saveData || undefined}
                            onChange={onChange}
                            shape={shape}
                            brushRadius={shape === 'pen' ? (brushSize ?? 2) : 2}
                            text={text}
                        />
                    </div>
                    {!show ? <></>
                        : <>
                            <div className="flex absolute top-2 right-2 space-x-2 z-20">
                                <button
                                    onClick={onUndo}
                                    className="z-10 flex flex-col dark:text-black items-center text-xs p-1 pt-2 uppercase space-y-1"
                                >
                                    <UndoIcon className="text-xl" />
                                    <p>{strings.Undo}</p>
                                </button>
                                <button
                                    onClick={onClear}
                                    className="z-10 flex flex-col dark:text-black items-center text-xs p-1 pt-2 uppercase space-y-1"
                                >
                                    <DeleteIcon className="text-xl" />
                                    <p>{strings.Clear}</p>
                                </button>
                            </div>
                            <div className="flex xl:flex-col space-x-3 xl:space-x-0 xl:space-y-3 select-none xl:absolute bottom-0 left-0 p-3 mx-auto justify-center" >
                                {
                                    // Colors
                                    procedureCanvasDrawColors.map((col) => {
                                        return (
                                            <button
                                                key={col}
                                                className={`p-3 rounded-full relative z-20 ${selectedColor === col ? 'ring-1 ring-gray-400' : ''}`}
                                                style={{ backgroundColor: col }}
                                                onClick={() => {
                                                    setSelectedColor(col);
                                                }}
                                            >
                                                <span
                                                    style={{ backgroundColor: col }}
                                                    className={`${selectedColor === col ? 'scale-[130%]' : ''} transform absolute rounded-full inset-0 -z-0 opacity-25`}></span>
                                            </button>
                                        );
                                    })
                                }
                            </div>
                            <div className="flex xl:flex-col space-x-3 xl:space-x-0 xl:space-y-3 select-none xl:absolute bottom-0 right-0 z-20 justify-center p-3">
                                <CanvasEditingButton onClick={onPen} text={strings.pen} icon={<PenIcon />} active={shape === 'pen'} />
                                <CanvasEditingButton onClick={onCircle} text={strings.circle} icon={<CircleIcon />} active={shape === 'circle'} />
                                <CanvasEditingButton onClick={onFilledCircle} text={strings.filledCircle} icon={<CircleFilledIcon />} active={shape === 'filled_circle'} />
                                <CanvasEditingButton onClick={onGradientCircle} text={strings.gradientCircle} icon={<CircleGradientIcon />} active={shape === 'gradient_circle'} />
                                <CanvasEditingButton onClick={onCross} text={strings.cross} icon={<CrossIcon />} active={shape === 'cross'} />
                                <CanvasEditingButton onClick={() => onText(text ?? "1")} text={strings.numbers} icon={text} active={shape === 'text'} />
                            </div>
                        </>
                    }
                    <TinyError
                        error={error}
                        helperText={helperText}
                    />
                </div>
                <div className="flex justify-center mt-2">
                    {shape !== 'text' ? <></> :
                        <PlusMinusComponent
                            prevDisabled={parseInt(text) === 1}
                            prevOnClick={() => {
                                const num = parseInt(text)
                                if (num && num > 1) {
                                    onText((num - 1).toString())
                                }
                            }}
                            text={text}
                            nextDisabled={brushSize === penSizes[penSizes.length - 1]}
                            nextOnClick={() => {
                                const num = parseInt(text)
                                if (num && num > 0) {
                                    onText((num + 1).toString())
                                }
                            }}
                        />
                    }
                    {shape !== 'pen' ? <></> :
                        <PlusMinusComponent
                            prevDisabled={brushSize === penSizes[0]}
                            prevOnClick={() => {
                                setBrushSize(penSizes[penSizes.findIndex(v => v === brushSize) - 1])
                            }}
                            text={(brushSize ?? '').toString()}
                            nextDisabled={brushSize === penSizes[penSizes.length - 1]}
                            nextOnClick={() => {
                                setBrushSize(penSizes[penSizes.findIndex(v => v === brushSize) + 1]);
                            }}
                        />
                    }
                </div>
                <div className="lg:hidden">
                    {
                        canvasWrapper
                            ? <div
                                className={`absolute rounded grid place-items-center lg:hidden bg-black bg-opacity-50 p-4 top-0 left-0 right-0 bottom-0`}
                                style={{ zIndex: 20 }}
                                onClick={() => setCanvasWrapper(false)}
                            >
                                <p className="text-white text-lg font-medium drop-shadow-lg">{strings.click_to_edit}</p>
                            </div>
                            : <div className="fixed bottom-4 w-screen left-0 grid place-items-center" style={{ zIndex: 80 }}>
                                <button
                                    className="rounded-full shadow-md bg-primary text-white px-4 py-1"
                                    onClick={() => setCanvasWrapper(true)}
                                >
                                    {strings.exit_editing}
                                </button>
                            </div>
                    }
                </div>
            </div>
        </>
    );
});

export interface PlusMinusComponentProps {
    prevOnClick?: () => void
    nextOnClick?: () => void
    text: string,
    prevDisabled?: boolean
    nextDisabled?: boolean
}

const PlusMinusComponentOG: React.FC<PlusMinusComponentProps> = ({
    prevOnClick,
    nextOnClick,
    text,
    prevDisabled,
    nextDisabled,
}) => {
    return (
        <div className="grid grid-cols-3 place-items-center bg-purpleGray dark:text-black mx-auto rounded-md">
            <button
                className="text-2xl w-10 h-10 flex justify-center items-center disabled:text-gray-400 "
                children={"-"}
                disabled={prevDisabled}
                onClick={prevOnClick}
            />
            <div className="text-center text-lg w-10 h-10 flex justify-center items-center">
                {text}
            </div>
            <button
                className="text-2xl w-10 h-10 flex justify-center items-center disabled:text-gray-400 "
                children={"+"}
                disabled={nextDisabled}
                onClick={nextOnClick}
            />
        </div>
    );
}
const PlusMinusComponent = memo(PlusMinusComponentOG)

export const MemoClientProcedureDrawing = memo(ClientProcedureDrawing);
export default ClientProcedureDrawing;