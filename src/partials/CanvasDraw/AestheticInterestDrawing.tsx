import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import DeleteIcon from "../Icons/Delete";
import UndoIcon from "../Icons/Undo";
import CanvasDraw from "./CanvasDraw";
import CanvasDrawDrawing from "./index";
import human0 from '../../images/human/human0.png';
import human1 from '../../images/human/human1.png';
import human2 from '../../images/human/human2.png';
import human3 from '../../images/human/human3.png';
import human4 from '../../images/human/human4.png';
import human5 from '../../images/human/human5.png';
import strings from "../../lang/Lang";
import TinyError from "../Error/TinyError";
import { debounce } from "lodash";
import useDebounce from "../../hooks/useDebounce";
import Select from "@components/form/Select";

export interface AestheticInterestDrawingProps {
    onChange?: (value: string, index: number) => void,
    error?: boolean,
    helperText?: string | boolean,
    name?: string,
    question?: string,
    value?: string,
    index?: number,
}
const options = [
    {
        value: human4,
        text: strings.Womanface,
    },
    {
        value: human1,
        text: strings.Manface,
    },
    {
        value: human5,
        text: strings.Womanbodyfront,
    },
    {
        value: human2,
        text: strings.Manbodyfront,
    },
    {
        value: human3,
        text: strings.Womanbodyback,
    },
    {
        value: human0,
        text: strings.Manbodyback,
    },
];

const AestheticInterestDrawing: React.FC<AestheticInterestDrawingProps> = ({
    onChange = () => {},
    error = false,
    helperText = '',
    name,
    question,
    value,
    index = 0,
}) => {
    const [selectedImage, setSelectedImage] = useState(!value || value === 'null' ? human4 : value);
    const canvasRef = useRef<CanvasDrawDrawing>(null);
    const [windowScrollTop, setWindowScrollTop] = useState(0);
    const [canvasWrapper, setCanvasWrapper] = useState(true);
    const debouncescrollTop = useDebounce(windowScrollTop, 300);

    useEffect(() => {
        if (!canvasRef?.current) return;
        canvasRef.current?.drawImage();
        return () => {};
    }, [selectedImage]);

    // eslint-disable-next-line
    const debouncedSave = useCallback(debounce(async (canvasRef, index) => {
        try {
            if (!canvasRef?.current) return;
            onChange(await canvasRef.current.getImageSaveData('jpeg'), index);
        } catch (error) {
            console.log(error);
        }
    }, 300), []);

    useEffect(() => {
        const scrollElement = document.getElementsByClassName("modal-scrollable-element").item(0)
        function scrollListener() { setWindowScrollTop(scrollElement?.scrollTop ?? 0) }
        scrollElement?.addEventListener('scroll', scrollListener);
        return () => {
            scrollElement?.removeEventListener('scroll', scrollListener);
        }
    }, []);

    useEffect(() => {
        if (canvasWrapper) return
        setCanvasWrapper(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncescrollTop]);

    return (
        <>
            <p className="flex-grow font-semibold mb-1"><span className="bg-primary h-2 w-2 rounded-full inline-block mr-2 mb-0.5" />{question}</p>
            <div className={`relative rounded border dark:border-gray-700 ${error ? 'border-error' : ''}`}>
                <div className="p-2 relative">
                    <Select
                        displayValue={() => options.find((option) => option.value === selectedImage)?.text ?? strings.Select}
                        onChange={(val) => {
                            setSelectedImage(val || human4);
                            if (!canvasRef?.current) return;
                            canvasRef.current.clear();
                        }}
                    >
                        {options.map((val) => <Select.Option key={val.value + val.text} value={val.value}>{val.text}</Select.Option>)}
                    </Select>
                </div>
                <div className="absolute border border-r-0 border-gray-600 rounded-l-md divide-y divide-gray-600 z-30 top-1/2 right-0 transform -translate-y-1/2">
                    <button
                        className="relative grid place-items-center px-2 pt-2 py-1"
                        onClick={(event) => {
                            event.stopPropagation();
                            if (!canvasRef?.current) return;
                            canvasRef.current.undo();
                        }}
                    >
                        <UndoIcon className="text-xl text-gray-600" />
                        <p className="text-xs text-gray-600">{strings.Undo}</p>
                    </button>
                    <button
                        className="relative grid place-items-center px-2 pt-2 py-1"
                        onClick={(event) => {
                            event.stopPropagation();
                            if (!canvasRef?.current) return;
                            canvasRef.current.clear();
                        }}
                    >
                        <DeleteIcon className="text-2xl text-gray-600" />
                        <p className="text-xs text-gray-600">{strings.Clear}</p>
                    </button>
                </div>
                <div className="relative">
                    <CanvasDraw
                        ref={canvasRef}
                        image={selectedImage}
                        color='red'
                        disabled={false}
                        canvasHeight={720}
                        onChange={() => {
                            if (!canvasRef?.current) return;
                            debouncedSave(canvasRef, index);
                        }}
                    />
                    <div className="lg:hidden">
                        {
                            canvasWrapper
                                ? <div
                                    className={`absolute rounded grid place-items-center lg:hidden bg-black bg-opacity-50 p-4 top-0 left-0 right-0 bottom-0`}
                                    style={{ zIndex: 55 }}
                                    onClick={() => setCanvasWrapper(false)}
                                >
                                    <p className="text-white text-lg font-medium drop-shadow-lg">{strings.click_to_edit}</p>
                                </div>
                                : <div className="absolute top-0 right-2" style={{ zIndex: 1000 }}>
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
            </div>
            <TinyError
                error={error}
                helperText={helperText}
            />
        </>
    );
}

export const MemoAestheticInterestDrawing = memo(AestheticInterestDrawing);

export default AestheticInterestDrawing;