import TextArea from '@components/form/TextArea';
import { FastField, getIn, useFormikContext } from 'formik';
import * as React from 'react';
import { HealthQuestionaryValues } from '../../interfaces/questionary';
import strings from '../../lang/Lang';
import QuestionYesNo from '../Portal/QuestionYesNo';

export interface HealthQuestionaryComponentProps {

}

const HealthQuestionaryComponent: React.FC<HealthQuestionaryComponentProps> = () => {
    const { values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext<HealthQuestionaryValues>();

    return (
        <div className="grid grid-cols-1 grid-flow-row divide-y dark:divide-gray-700">
            {
                values?.data?.map((value, index) => {
                    const views: React.ReactNode[] = [];
                    if (Object.keys(value).includes('answer')) {
                        views.push(
                            <FastField name={`data.${index}.answer`} key={`data.${index}.answer`}>
                                {({ field, form, meta }: { field: string, form: string, meta: string }) => {
                                    return <QuestionYesNo
                                        name={`data.${index}.answer`}
                                        error={!!getIn(touched, `data.${index}`) && !!getIn(errors, `data.${index}.answer`)}
                                        helperText={getIn(errors, `data.${index}.answer`)}
                                        // @ts-ignore
                                        question={strings[`health_question_new_${index.toString()}`]}
                                        showBullet={false}
                                        value={value.answer}
                                        onChange={async (data) => {
                                            await setFieldValue(`data.${index}.answer`, data, false);
                                            setFieldTouched(`data.${index}.answer`);
                                        }}
                                    />
                                }}
                            </FastField>
                        );
                    }
                    if (Object.keys(value).includes('more_info')) {
                        const hasAnswer = Object.keys(value).includes('answer');

                        let label = strings.yes_textarea;
                        if (index === 22) {
                            //@ts-ignore
                            label = strings[`yes_textarea${index === 22 ? `_${index}` : ''}`];
                        }

                        if (!hasAnswer) {
                            //@ts-ignore
                            label = strings[`health_question_new_${index}`];
                        }


                        views.push(
                            <FastField name={`data.${index}.more_info`} key={`data.${index}.more_info`}>
                                {({ field, form, meta }: { field: string, form: string, meta: string }) => {
                                    return (
                                        <div className={`${hasAnswer ? 'pl-4' : ''}`}>
                                            {/* @ts-ignore */}
                                            <label className="text-sm text-gray-500 dark:text-gray-300 mb-1 inline-block" htmlFor={`data.${index}.more_info`}>{label}</label>
                                            <TextArea
                                                id={`data.${index}.more_info`}
                                                name={`data.${index}.more_info`}
                                                rows={4}
                                                value={value.more_info}
                                                onChange={async (e) => {
                                                    await setFieldValue(`data.${index}.more_info`, e.target.value, false)
                                                    setFieldTouched(`data.${index}.more_info`);
                                                }}
                                                error={!!getIn(touched, `data.${index}`) && getIn(errors, `data.${index}.more_info`)}
                                            />
                                        </div>
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

export default HealthQuestionaryComponent;