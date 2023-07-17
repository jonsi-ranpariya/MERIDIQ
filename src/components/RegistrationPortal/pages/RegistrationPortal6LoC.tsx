import Autocomplete from "@components/form/Autocomplete";
import Button from '@components/form/Button';
import { LetterOfConsent } from "@interface/model/letterOfConsent";
import { FormikErrors, useFormikContext } from "formik";
import React, { useState } from "react";
import { useParams } from "react-router";
import SignaturePad from "signature_pad";
import useSWR from "swr";
import api from "../../../configs/api";
import { commonFetch } from "../../../helper";
import useRegistrationPortal from "../../../hooks/useRegistrationPortal";
import { LetterOfConsentResponse } from "../../../interfaces/common";
import strings from "../../../lang/Lang";
import ServerError from "../../../partials/Error/ServerError";
import FormikErrorFocus, { goToError } from "../../../partials/FormikErrorFocus/FormikErrorFocus";
import Checkbox from "../../../partials/MaterialCheckbox/MaterialCheckbox";
import QuestionYesNo from "../../../partials/Portal/QuestionYesNo";
import ScrollToTopOnMount from "../../../partials/Scroll/ScrollToTopOnMount";
import MaterialSignturePad from "../../../partials/SignaturePad/MaterialSignaturePad";
import { validateClientLetterOfConsent } from "../../../validations";
import RegistrationCard from "../card/RegistrationCard";
import RegistrationPortalLoCListItem from './LoC/RegistrationPortalLoCListItem';
import RegistrationPortalConsent from "./RegistrationPortalConsent";

export interface RegistrationPortal6LoCProps {

}

export interface IClientLetterOfConsentMultipleValues {
    values: {
        consent_id: number,
        is_publish_before_after_pictures: 0 | 1 | null,
        signed_file: File | null,
        signature: string | null,
    }[],
    consent_id: number,
    is_publish_before_after_pictures: 0 | 1 | null,
    signature: string | null,
    showSignature?: boolean,
    consent_agreed: boolean,
    server?: string,
}

const RegistrationPortal6LoC: React.FC<RegistrationPortal6LoCProps> = () => {

    const { companyId }: { companyId?: string } = useParams();
    const { data } = useSWR<LetterOfConsentResponse, Error>(!companyId ? null : api.letterOfConsentPublic.replace(':companyId', companyId), commonFetch);
    const canvasRef = React.useRef<SignaturePad>(null);

    const {
        isSubmitting, isValidating, handleSubmit, setFieldValue, values, errors, setErrors,
    } = useFormikContext<IClientLetterOfConsentMultipleValues>();

    const [isAddLetter, setIsAddLetter] = useState(false);

    const { previous, nextPageTitle } = useRegistrationPortal();

    const textData = React.useCallback((consent_id: number) => {
        if (data?.data && data?.data.length) {
            const letterOfConsent = data.data.find((letterOfConsent) => letterOfConsent.id === consent_id);
            if (letterOfConsent && letterOfConsent.letter_html) {
                // eslint-disable-next-line react/no-danger
                return <div className="prose prose-sm dark:prose-invert max-w-full" dangerouslySetInnerHTML={{ __html: letterOfConsent.letter_html }} />;
            } if (letterOfConsent && letterOfConsent.letter) {
                return <p>{letterOfConsent.letter}</p>;
            }
        }
    }, [data]);

    return (
        <RegistrationCard fullWidth title={strings.LettersofConsents}>
            <ScrollToTopOnMount />
            <div className="">

                <div className="grid grid-flow-row grid-cols-1 gap-4">
                    <FormikErrorFocus />
                    <Autocomplete<LetterOfConsent>
                        options={data?.data || []}
                        inputProps={{ name: "consent_id", placeholder: strings.Select_a_consent }}
                        renderOption={(option) => option.consent_title}
                        value={data?.data.find(val => val.id === values.consent_id)}
                        onChange={async (value) => {
                            if (!value?.id)
                                return;
                            await setFieldValue('consent_id', value?.id, false);

                            if (!isAddLetter)
                                return;
                            const errors = await validateClientLetterOfConsent({ ...values, consent_id: value?.id }) as FormikErrors<IClientLetterOfConsentMultipleValues>;
                            if (Object.keys(errors).length !== 0) {
                                await setErrors(errors);
                                goToError(errors);
                                return;
                            }
                            await setErrors({});
                        }}
                        error={errors.consent_id}
                        displayValue={(option) => option?.consent_title ?? ''}
                        filteredValues={(query) => {
                            return data?.data.filter((country) => country.consent_title.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))) ?? []
                        }}
                    />

                    {values.consent_id ?
                        <div>
                            <p className="font-semibold mb-1">{strings.Information}</p>
                            {textData(values.consent_id)}
                        </div>
                        : ''}

                    <QuestionYesNo
                        question={strings.Are_we_allowed_to_publish_before_and_after_pictures}
                        onChange={async (val) => {
                            await setFieldValue('is_publish_before_after_pictures', val, false)

                            if (!isAddLetter) return;
                            const errors = await validateClientLetterOfConsent({ ...values, is_publish_before_after_pictures: val }) as FormikErrors<IClientLetterOfConsentMultipleValues>;
                            if (Object.keys(errors).length !== 0) {
                                await setErrors(errors);
                                goToError(errors);
                                return;
                            }
                            await setErrors({});

                        }}
                        name="is_publish_before_after_pictures"
                        showBullet
                        value={values.is_publish_before_after_pictures}
                        error={Boolean(errors.is_publish_before_after_pictures)}
                        helperText={errors.is_publish_before_after_pictures}
                    />
                    {
                        values.showSignature
                            ? <MaterialSignturePad
                                ref={canvasRef}
                                onEnd={async () => {
                                    if (!canvasRef || !canvasRef.current) return;
                                    setFieldValue('signature', canvasRef.current.toDataURL());
                                }}
                                error={Boolean(errors.signature)}
                                helperText={errors.signature ?? ''}
                                onClear={async () => {
                                    await setFieldValue('signature', '');
                                    canvasRef.current?.clear();
                                }}
                            />
                            : <Checkbox
                                key={"consent_agree"}
                                checked={values.consent_agreed}
                                onChange={(e) => setFieldValue('consent_agreed', e.target.checked)}
                                error={Boolean(errors.consent_agreed)}
                                helperText={errors.consent_agreed}
                                name="consent_agreed"
                                label={strings.formatString(strings.i_accept_the_consent, "") as string}
                            />
                    }
                    <div className="mx-auto">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={async () => {
                                setIsAddLetter(true);
                                const errors = await validateClientLetterOfConsent(values) as FormikErrors<IClientLetterOfConsentMultipleValues>;
                                if (Object.keys(errors).length !== 0) {
                                    await setErrors(errors);
                                    goToError(errors);
                                    return;
                                }
                                await setFieldValue('values', [...values.values, values], false);

                                await setFieldValue('consent_id', 0, false);
                                await setFieldValue('consent_agreed', false, false);
                                await setFieldValue('is_publish_before_after_pictures', null, false);
                                await setFieldValue('signed_file', null, false);
                                await setFieldValue('signature', null, false);
                                canvasRef.current?.clear();
                            }}
                            disabled={isSubmitting || isValidating}
                        >{strings.ADD_LETTER_OF_CONSENT}</Button>
                    </div>
                    {values?.values?.length
                        ? <div>
                            <hr className="mb-2" />
                            <p className="font-md font-bold">{strings.AddedLetterOfConsents}</p>
                        </div> : ''}
                    {
                        values?.values?.map((letter, index) => {
                            return (
                                <RegistrationPortalLoCListItem
                                    key={index}
                                    letterId={letter.consent_id}
                                    onDeleteClick={async () => {
                                        await setFieldValue('values', values.values.filter((_, valueIndex) => valueIndex !== index), false);
                                    }}
                                />
                            );
                        })
                    }
                    <RegistrationPortalConsent />

                    <ServerError error={errors?.server} className="mt-4" />

                    <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-6 my-10">
                        <div className="">
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() => {
                                    previous()
                                }}
                                disabled={isSubmitting || isValidating}
                            >{strings.PREVIOUS}</Button>
                        </div>
                        <div className="">
                            <Button
                                loading={isSubmitting || isValidating}
                                fullWidth
                                onClick={async () => {
                                    await handleSubmit();
                                }}
                            >{nextPageTitle}</Button>
                        </div>
                    </div>

                </div>
            </div>
        </RegistrationCard>
    );
}

export default RegistrationPortal6LoC;