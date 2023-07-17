import TextArea from '@components/form/TextArea';
import { FastField, getIn, useFormikContext } from 'formik';
import * as React from 'react';
import { DynamicQuestionaryValues } from '../../components/Clients/Client/Questionaries/DynamicQuestionary/ClientDynamicQuestionariesModal';
import api from '../../configs/api';
import strings from '../../lang/Lang';
import QuestionYesNo from '../Portal/QuestionYesNo';

export interface DynamicQuestionaryComponentProps {

}

const DynamicQuestionaryComponent: React.FC<DynamicQuestionaryComponentProps> = () => {
    const { values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext<DynamicQuestionaryValues>();

    return (
        <div className="grid grid-cols-1 grid-flow-row gap-4">
            {
                values?.data?.map((value, index) => {
                    const views: React.ReactNode[] = [];
                    const hasTextarea = value.type === api.questionTypes1.textbox.value || value.type === api.questionTypes1.yes_no_textbox.value;
                    const isYesNo = value.type === api.questionTypes1.yes_no_textbox.value || value.type === api.questionTypes1.yes_no.value;
                    const isTextarea4YesNo = value.type === api.questionTypes1.yes_no_textbox.value;

                    if (isYesNo) {
                        views.push(
                            <FastField name={`data.${index}.value`} key={`data.${index}.value`}>
                                {({ field, form, meta }: { field: string, form: string, meta: string }) => {
                                    return <QuestionYesNo
                                        name={`data.${index}.value`}
                                        error={!!getIn(touched, `data.${index}`) && !!getIn(errors, `data.${index}.value`)}
                                        helperText={getIn(errors, `data.${index}.value`)}
                                        // @ts-ignore
                                        question={getIn(values, `data.${index}.question`)}
                                        showBullet
                                        value={value.value}
                                        onChange={async (data) => {
                                            await setFieldValue(`data.${index}.value`, data, false);
                                            setFieldTouched(`data.${index}.value`);
                                        }}
                                    />
                                }}
                            </FastField>
                        );
                    }
                    if (hasTextarea) {
                        let label = isTextarea4YesNo ? strings.anymore_detail : getIn(values, `data.${index}.question`);

                        views.push(
                            <FastField name={`data.${index}.text`} key={`data.${index}.text`}>
                                {({ field, form, meta }: { field: string, form: string, meta: string }) => {
                                    return (
                                        <div className={`${isTextarea4YesNo ? 'pl-4' : ''}`}>
                                            <label className={`${!isTextarea4YesNo ? 'font-medium' : 'text-sm text-gray-500 dark:text-gray-300'}  inline-block mb-2`} htmlFor={`data.${index}.text`}>{label}</label>
                                            <TextArea
                                                id={`data.${index}.text`}
                                                name={`data.${index}.text`}
                                                rows={4}
                                                value={value.text}
                                                onChange={async (e) => {
                                                    await setFieldValue(`data.${index}.text`, e.target.value, false)
                                                    setFieldTouched(`data.${index}.text`);
                                                }}
                                                error={!!getIn(touched, `data.${index}`) && getIn(errors, `data.${index}.text`)}
                                            />
                                        </div>
                                    );
                                }}
                            </FastField>
                        );
                    }

                    return (
                        <div key={index} className="w-full">
                            {views}
                        </div>
                    )
                })
            }
        </div>
    );
}

export default DynamicQuestionaryComponent;