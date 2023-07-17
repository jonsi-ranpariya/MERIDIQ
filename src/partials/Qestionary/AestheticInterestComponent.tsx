import TextArea from '@components/form/TextArea';
import { FastField, getIn, useFormikContext } from 'formik';
import * as React from 'react';
import { AestheticInterestValues } from '../../interfaces/questionary';
import strings from '../../lang/Lang';
import { MemoAestheticInterestDrawing } from '../CanvasDraw/AestheticInterestDrawing';
import QuestionMultipleAnswer from '../Portal/QuestionMultipleAnswer';

export interface AestheticInterestComponentProps {

}

const AestheticInterestComponent: React.FC<AestheticInterestComponentProps> = () => {
    const { values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext<AestheticInterestValues>();

    const onDrawingChange = React.useCallback(
        async (value: string, index: number) => {
            await setFieldValue(`data.${index}.image`, value, false);
            setFieldTouched(`data.${index}.image`);
        }, [setFieldValue, setFieldTouched]);

    return (
        <div className="grid grid-cols-1 grid-flow-row divide-y dark:divide-dimGray">
            {
                values?.data?.map((value, index) => {
                    const views: React.ReactNode[] = [];
                    const keys = Object.keys(value);
                    if (keys.includes('answer_checkbox')) {
                        views.push(
                            <React.Fragment key={`data.${index}.answer_checkbox`}>
                                <FastField name={`data.${index}.answer_checkbox`}>
                                    {() => {
                                        return (
                                            <QuestionMultipleAnswer
                                                name={`data.${index}.answer_checkbox`}
                                                error={!!getIn(touched, `data.${index}`) && !!getIn(errors, `data.${index}.answer_checkbox`)}
                                                helperText={getIn(errors, `data.${index}.answer_checkbox`)}
                                                // @ts-ignore
                                                question={strings[`aestethic_question_new_${index}`]}
                                                showBullet
                                                options={(value?.answer_checkbox || []).map((data, checkBoxIndex) => {
                                                    // @ts-ignore
                                                    return strings[`aestethic_question_new_${index}_${checkBoxIndex}`];
                                                })}
                                                values={value?.answer_checkbox || []}
                                                onChange={async (optionIndex, checked) => {
                                                    await setFieldValue(`data.${index}.answer_checkbox`, (value?.answer_checkbox || []).map((value, checkBoxIndex) => {
                                                        if (checkBoxIndex === optionIndex) {
                                                            return checked ? 1 : 0;
                                                        }
                                                        return value;
                                                    }), false);
                                                    setFieldTouched(`data.${index}.answer_checkbox`);
                                                }}
                                            />
                                        )
                                    }}
                                </FastField>
                                {value?.answer_checkbox?.length && value.answer_checkbox[value.answer_checkbox.length - 1] === 1 && Object.keys(value).includes('other') ?
                                    (
                                        <TextArea
                                            id={`data.${index}.other`}
                                            name={`data.${index}.other`}
                                            rows={4}
                                            value={value.other}
                                            onChange={async (e) => {
                                                await setFieldValue(`data.${index}.other`, e.target.value, false)
                                                setFieldTouched(`data.${index}.other`);
                                            }}
                                            error={!!getIn(touched, `data.${index}`) && getIn(errors, `data.${index}.other`)}
                                        />
                                    ) : ''}
                            </React.Fragment>
                        );
                    }
                    if (keys.includes('notes')) {
                        views.push(
                            <FastField name={`data.${index}.notes`} key={`data.${index}.notes`}>
                                {() => {
                                    return (
                                        <div>
                                            <label
                                                className="text-sm text-gray-500 dark:text-gray-300 mb-2 inline-block" htmlFor={`data.${index}.notes`}
                                            >
                                                {/* @ts-ignore */}
                                                {strings[`aestethic_question_new_${index}`]}
                                            </label>
                                            <TextArea

                                                id={`data.${index}.notes`}
                                                name={`data.${index}.notes`}

                                                rows={4}
                                                value={value.notes}
                                                onChange={async (e) => {
                                                    await setFieldValue(`data.${index}.notes`, e.target.value, false)
                                                    setFieldTouched(`data.${index}.notes`);
                                                }}
                                                error={!!getIn(touched, `data.${index}`) && getIn(errors, `data.${index}.notes`)}
                                            />
                                        </div>
                                    );
                                }}
                            </FastField>
                        );
                    }

                    if (keys.includes('image')) {
                        views.push(
                            <FastField
                                name={`data.${index}.image`}
                                shouldUpdate={() => false}
                                key={`data.${index}.image`}
                            >
                                {() => {
                                    return (
                                        <MemoAestheticInterestDrawing
                                            // key={`data.${index}.image`}
                                            name={`data.${index}.image`}
                                            value={value.image as string || ''}
                                            index={index}
                                            // @ts-ignore
                                            question={strings[`aestethic_question_new_${index}`]}
                                            onChange={onDrawingChange}
                                            error={!!getIn(touched, `data.${index}`) && !!getIn(errors, `data.${index}.image`)}
                                            helperText={getIn(errors, `data.${index}.image`)}
                                        />
                                    );
                                }}
                            </FastField>
                        );
                    }

                    return (
                        <div key={index} className="w-full py-4">
                            {views}
                        </div>
                    )
                })
            }
        </div>
    );
}

export default AestheticInterestComponent;