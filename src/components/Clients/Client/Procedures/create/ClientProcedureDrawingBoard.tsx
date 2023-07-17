import AddRoundIcon from '@partials/Icons/AddRound';
import { FastField, FastFieldAttributes, FormikProps, getIn, useFormikContext } from 'formik';
import React from 'react';
import strings from '../../../../../lang/Lang';
import { MemoClientProcedureDrawing } from '../../../../../partials/CanvasDraw/ClientProcedureDrawing';
import CanvasDrawDrawing from "../../../../../partials/CanvasDraw/index";
import ChevronIcon from '../../../../../partials/Icons/Chevron';
import DeleteIcon from '../../../../../partials/Icons/Delete';
import Button from '@components/form/Button';
import { IClientProcedureCreateValues } from './ClientProcedureCreate';
import { MemoClientProcedurePicture } from './ClientProcedurePicture';

interface IClientProcedureDrawingBoard {
    onUndo?: () => void,
    onClear?: () => void,
    onAddPage?: () => void,
    onDeletePage?: () => void,
    onChange?: () => void,
    onPen?: () => void,
    onCross?: () => void,
    onPenFat?: () => void,
    onCrossFat?: () => void,
    onCircle?: () => void,
    onFilledCircle?: () => void,
    onGradientCircle?: () => void,
    onText?: (text: string) => void,
    onChangePage?: (data: number) => void,
}

const ClientProcedureDrawingBoard = React.forwardRef<CanvasDrawDrawing, IClientProcedureDrawingBoard>(({
    onAddPage = () => { },
    onClear = () => { },
    onDeletePage = () => { },
    onChange = () => { },
    onUndo = () => { },
    onChangePage = () => { },
    onPen = () => { },
    onCross = () => { },
    onPenFat = () => { },
    onCrossFat = () => { },
    onCircle = () => { },
    onFilledCircle = () => { },
    onText = () => { },
    onGradientCircle = () => { },
}, canvasRef) => {
    const { values } = useFormikContext<IClientProcedureCreateValues>();

    return (
        <div className="xl:col-span-2 select-none">
            <MemoClientProcedurePicture />
            <div className="bg-white dark:bg-black rounded-lg border dark:border-dimGray border-lightPurple">
                <FastField
                    key={values.selectedIndex}
                    names={[
                        `images.${values.selectedIndex}.id`,
                        `images.${values.selectedIndex}.image`,
                        'selectedIndex',
                        'shape',
                        'brushRadius',
                        'text',
                    ]}
                    shouldUpdate={(
                        props: FastFieldAttributes<IClientProcedureCreateValues & { formik: FormikProps<IClientProcedureCreateValues>, names?: string[] }>,
                        currentProps: FastFieldAttributes<IClientProcedureCreateValues & { formik: FormikProps<IClientProcedureCreateValues>, names?: string[] }>,
                    ) => {

                        for (const name of props?.names || []) {
                            if (getIn(props.formik.values, name) !== getIn(currentProps.formik.values, name) || getIn(props.formik.errors, name) !== getIn(currentProps.formik.errors, name) || getIn(props.formik.touched, name) !== getIn(currentProps.formik.touched, name) || Object.keys(currentProps).length !== Object.keys(props).length || props.formik.isSubmitting !== currentProps.formik.isSubmitting) {

                                return true;
                            }
                        }

                        return false;
                    }}
                >
                    {() => (
                        <MemoClientProcedureDrawing
                            key={getIn(values.images, `${values.selectedIndex}.id`)}
                            index={values.selectedIndex}
                            ref={canvasRef}
                            value={getIn(values.images, `${values.selectedIndex}.image`)}
                            saveData={getIn(values.images, `${values.selectedIndex}.canvasData`)}
                            onClear={onClear}
                            onUndo={onUndo}
                            onChange={onChange}
                            onCircle={onCircle}
                            onPen={onPen}
                            onPenFat={onPenFat}
                            onCross={onCross}
                            onCrossFat={onCrossFat}
                            onFilledCircle={onFilledCircle}
                            onGradientCircle={onGradientCircle}
                            onText={onText}
                            shape={values.shape}
                            brushRadius={values.brushRadius}
                            text={values.text}
                            show
                        />
                    )}
                </FastField>
                <div className="flex justify-center">
                    <div className="flex space-x-4 py-3">
                        <FastField
                            names={[
                                `images`,
                                'selectedIndex',
                            ]}
                            shouldUpdate={(
                                props: FastFieldAttributes<IClientProcedureCreateValues & { formik: FormikProps<IClientProcedureCreateValues>, names?: string[] }>,
                                currentProps: FastFieldAttributes<IClientProcedureCreateValues & { formik: FormikProps<IClientProcedureCreateValues>, names?: string[] }>,
                            ) => {

                                for (const name of props?.names || []) {
                                    if (getIn(props.formik.values, name) !== getIn(currentProps.formik.values, name) || getIn(props.formik.errors, name) !== getIn(currentProps.formik.errors, name) || getIn(props.formik.touched, name) !== getIn(currentProps.formik.touched, name) || Object.keys(currentProps).length !== Object.keys(props).length || props.formik.isSubmitting !== currentProps.formik.isSubmitting) {

                                        return true;
                                    }
                                }

                                return false;
                            }}
                        >
                            {() => {
                                return (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            disabled={values.images.length === 1}
                                            onClick={async () => {
                                                if (values.images.length === 1) return;
                                                await onDeletePage();
                                            }}
                                        >
                                            <span className="flex items-center space-x-2">
                                                <DeleteIcon />
                                                <p className='hidden lg:inline'>{strings.Delete}</p>
                                            </span>
                                        </Button>
                                        <div className='flex items-center border dark:border-gray-700 rounded-md'>
                                            <button
                                                className='h-10 w-10 flex justify-center items-center disabled:text-gray-400'
                                                disabled={values.selectedIndex === 0}
                                                onClick={async () => {
                                                    if (values.selectedIndex === 0) return;
                                                    await onChangePage(values.selectedIndex - 1);
                                                }}
                                            >
                                                <ChevronIcon side='left' />
                                            </button>
                                            <div className="h-10 flex justify-center items-center">
                                                <p className="">{`${strings.page}: ${values.selectedIndex + 1}/${values.images.length}`}</p>
                                            </div>
                                            <button
                                                className="h-10 w-10 flex justify-center items-center disabled:text-gray-400"
                                                disabled={(values.images.length - 1) <= values.selectedIndex}
                                                onClick={async () => {
                                                    if ((values.images.length - 1) <= values.selectedIndex) return;
                                                    await onChangePage(values.selectedIndex + 1);
                                                }}
                                            >
                                                <ChevronIcon side='right' />
                                            </button>
                                        </div>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={onAddPage}
                                        >
                                            <span className="flex items-center space-x-2">
                                                <AddRoundIcon className='text-xl' />
                                                <p className='hidden lg:inline'>{strings.create}</p>
                                            </span>
                                        </Button>
                                    </>
                                )
                            }}
                        </FastField>
                    </div>
                </div>
            </div>
        </div>
    )
});

export default ClientProcedureDrawingBoard;