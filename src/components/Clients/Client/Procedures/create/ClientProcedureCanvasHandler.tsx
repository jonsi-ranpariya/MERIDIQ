import { getIn, useFormikContext } from 'formik';
import React, { useCallback, useEffect, useRef } from 'react'
import { CanvasShape, IClientProcedureCreateValues } from './ClientProcedureCreate';
import CanvasDrawDrawing from "../../../../../partials/CanvasDraw/index";
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

interface ClientProcedureCanvasHandlerProps {
    children: (data: {
        onDrawingChange: () => Promise<void>,
        changePage: (index: any) => Promise<void> | undefined,
        addPage: () => Promise<void> | undefined,
        deletePage: () => Promise<void> | undefined,
        clear: () => void,
        undo: () => void,
        onChange: () => void,
        onShapeChange: (shape: CanvasShape, brushRadius?: number, text?: string) => void,
        canvasRef: React.RefObject<CanvasDrawDrawing>,
    }) => React.ReactNode,
}

const ClientProcedureCanvasHandler: React.FC<ClientProcedureCanvasHandlerProps> = (props) => {
    const canvasRef = useRef<CanvasDrawDrawing>(null);
    const { values, setValues, setFieldValue, setFieldTouched } = useFormikContext<IClientProcedureCreateValues>();

    const onDrawingChange = useCallback(
        async () => {
            console.log("drawing change: ");
            if (!canvasRef.current) return;
            console.log("called Drawing save: ");
            const imageData = await canvasRef.current?.getImageSaveData('jpeg');
            const canvasData = await canvasRef.current?.getSaveData();

            await setValues((values) => {
                const newImages = values.images.map((image, index) => {
                    if (index === values.selectedIndex) {
                        return {
                            ...image,
                            imageData: imageData,
                            canvasData: canvasData,
                            updated: image.updated ? true : canvasRef.current?.isDirty()
                        };
                    }
                    return image;
                });

                return {
                    ...values,
                    images: newImages
                };
            }, false);
        },
        [setValues]);

    // eslint-disable-next-line
    const changePage = useCallback(debounce(async (index) => {
        try {
            await onDrawingChange();
            await setValues((values) => {
                return {
                    ...values,
                    selectedIndex: index
                }
            }, false);
        } catch (error) {
            console.log(error);
        }
    }, 500), [setValues]);

    // eslint-disable-next-line
    const addPage = useCallback(debounce(async () => {
        try {
            await onDrawingChange();

            await setValues((values) => {
                // console.log("addPage: ", values.images);
                const newImages = [
                    ...values.images,
                    {
                        image: '',
                        imageData: '',
                        canvasData: '',
                        id: uuidv4(),
                        updated: true,
                    }
                ];

                return {
                    ...values,
                    images: newImages,
                    selectedIndex: newImages.length - 1
                }
            }, false);
        } catch (error) {
            console.log(error);
        }
    }, 500), [setValues]);

    // eslint-disable-next-line
    const deletePage = useCallback(debounce(async () => {
        try {
            await setValues((values) => {
                const deletedIds = values?.deletedIds ?? [];
                const newImages = values.images.filter((value, index) => {
                    if (index === values.selectedIndex) {
                        if (value.fileId) {
                            deletedIds.push(value.fileId as number);
                        }

                        return false;
                    }

                    return true;
                });

                return {
                    ...values,
                    deletedIds: deletedIds,
                    images: newImages,
                    selectedIndex: values.selectedIndex > (newImages.length - 1) ? newImages.length - 1 : values.selectedIndex,
                }
            }, false);
        } catch (error) {
            console.log(error);
        }
    }, 500), [setValues]);

    const undo = useCallback(() => {
        if (!canvasRef.current) return;
        canvasRef.current.undo();
    }, []);

    const clear = useCallback(() => {
        if (!canvasRef.current) return;
        canvasRef.current.clear();
    }, []);

    const onChange = useCallback(() => {
        if (!canvasRef.current) return;

        if (canvasRef.current.isDirty()) {
            setValues((values) => {
                const newImages = values.images.map((image, index) => {
                    if (index === values.selectedIndex && !image?.updated) {
                        return {
                            ...image,
                            updated: true,
                        };
                    }
                    return image;
                });

                return {
                    ...values,
                    images: newImages
                };
            }, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onShapeChange = useCallback(async (shape: CanvasShape, brushRadius = 2, text?: string) => {
        await setFieldTouched('shape');
        await setFieldValue('shape', shape);

        await setFieldTouched('brushRadius');
        await setFieldValue('brushRadius', brushRadius);

        await setFieldTouched('text');
        await setFieldValue('text', parseInt(text ?? values.text ?? '1').toString());
    }, [setFieldValue, setFieldTouched, values.text]);

    useEffect(() => {
        console.log("useEffect called");
        if (!canvasRef?.current) return;
        canvasRef.current?.delete();
        canvasRef.current.drawImage();
        // eslint-disable-next-line
    }, [getIn(values.images, `${values.selectedIndex}.image`)]);

    return <>{props.children({ onDrawingChange, changePage, addPage, deletePage, clear, undo, canvasRef, onChange, onShapeChange })}</>;
}

export default ClientProcedureCanvasHandler
