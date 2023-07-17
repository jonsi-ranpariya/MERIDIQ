import Avatar from '@components/avatar/Avatar';
import CalendarSelect from '@components/Calendar/Custom/CalendarSelect';
import Button from '@components/form/Button';
import CountrySelect from '@components/form/CountrySelect';
import Input from '@components/form/Input';
import PhoneSelect from '@components/form/PhoneSelect';
import Heading from '@components/heading/Heading';
import { findCountryByCode } from '@configs/countries';
import { FastField, getIn, useFormikContext } from "formik";
import { useRef } from "react";
import api from "../../../configs/api";
import { heic2convert, toBase64 } from "../../../helper";
import useRegistrationPortal from "../../../hooks/useRegistrationPortal";
import { Setting } from "../../../interfaces/model/setting";
import strings from "../../../lang/Lang";
import ServerError from "../../../partials/Error/ServerError";
import TinyError from "../../../partials/Error/TinyError";
import FormikErrorFocus from "../../../partials/FormikErrorFocus/FormikErrorFocus";
import ScrollToTopOnMount from "../../../partials/Scroll/ScrollToTopOnMount";
import RegistrationCard from '../card/RegistrationCard';
import RegistrationPortalConsent from "./RegistrationPortalConsent";


export interface RegistrationPortal2Props {
    settings: Setting[],
}

export interface RegistrationPortal2Values {
    profile_picture: string;
    first_name: string;
    last_name: string;
    social_security_number: string;
    email: string;
    personal_id: string;
    phone_number: string;
    occupation: string;
    country: string;
    country_code: string;
    state: string;
    city: string;
    zip_code: string;
    street_address: string;
    companyId: string;
    server?: string,
    extra: {
        id: number,
        value: string,
        name: string,
        required: boolean,
    }[]
}

const RegistrationPortal2: React.FC<RegistrationPortal2Props> = ({ settings }) => {

    const profilePhotoRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

    const { previous, nextPageTitle } = useRegistrationPortal();
    const { values, errors, touched, isSubmitting, setFieldTouched, setFieldValue, isValidating, handleSubmit, handleChange, handleBlur } = useFormikContext<RegistrationPortal2Values>();
    function findValue(key: string) {
        return !!settings.find((setting) => setting.key === key && setting.value === '1');
    }

    let viewProfile = findValue(api.registrationPortal.viewProfile);
    let requiredProfile = findValue(api.registrationPortal.requiredProfile);

    let viewPhone = findValue(api.registrationPortal.viewPhone);
    let requiredPhone = findValue(api.registrationPortal.requiredPhone);

    let viewDateOfBirth = findValue(api.registrationPortal.viewDateOfBirth);
    let requiredDateOfBirth = findValue(api.registrationPortal.requiredDateOfBirth);

    let viewOccupation = findValue(api.registrationPortal.viewOccupation);
    let requiredOccupation = findValue(api.registrationPortal.requiredOccupation);

    let viewStreetAddress = findValue(api.registrationPortal.viewStreetAddress);
    let requiredStreetAddress = findValue(api.registrationPortal.requiredStreetAddress);

    let viewCity = findValue(api.registrationPortal.viewCity);
    let requiredCity = findValue(api.registrationPortal.requiredCity);

    let viewState = findValue(api.registrationPortal.viewState);
    let requiredState = findValue(api.registrationPortal.requiredState);

    let viewCountry = findValue(api.registrationPortal.viewCountry);
    let requiredCountry = findValue(api.registrationPortal.requiredCountry);

    let viewZipcode = findValue(api.registrationPortal.viewZipcode);
    let requiredZipcode = findValue(api.registrationPortal.requiredZipcode);

    let viewPersonalID = findValue(api.registrationPortal.viewPersonalID);
    let requiredPersonalID = findValue(api.registrationPortal.requiredPersonalID);

    return (
        <RegistrationCard>
            <ScrollToTopOnMount />
            <div className="pt-4">
                <Heading text={strings.Personalinformation} variant="bigTitle" />
                <FormikErrorFocus />
                <div className="py-4"></div>
                {viewProfile ? <FastField name="profile_picture">
                    {() => (
                        <div className='flex'>
                            <div className="mt-4">
                                <label htmlFor="profile_picture_id">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="profile_picture_id"
                                        // name="profile_picture"
                                        ref={profilePhotoRef}
                                        required={requiredProfile}
                                        onChange={async (event) => {
                                            if (!event?.target?.files?.length) return;
                                            let file: File | Blob | null = event.target.files[0];

                                            if (file && !file.type) {
                                                file = await heic2convert(file);
                                            }

                                            const imageData = await toBase64(file);
                                            setFieldTouched('profile_picture')
                                            setFieldValue('profile_picture', imageData)
                                        }}
                                        accept=".png,.jpg,.jpeg,.heic"
                                    />
                                    <Avatar
                                        className="h-24 w-24 mb-2 mt-4 object-top"
                                        src={values.profile_picture ? values.profile_picture : undefined}
                                    />
                                </label>
                                <div className="text-center mb-4 -ml-5">
                                    <TinyError error={!!errors.profile_picture && !!touched.profile_picture} helperText={errors.profile_picture} />
                                </div>
                            </div>
                        </div>
                    )}
                </FastField> : <></>}
                <div className="py-2"></div>
                <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-6">
                    <FastField name="first_name">
                        {() => (
                            <Input
                                name="first_name"
                                type="text"
                                value={values.first_name || ''}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched?.first_name && errors.first_name}
                                label={strings.FIRSTNAME}
                                required
                            />
                        )}
                    </FastField>
                    <FastField name="last_name">
                        {() => (
                            <Input
                                name="last_name"
                                type="text"
                                value={values.last_name || ''}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched?.last_name && errors.last_name}
                                label={strings.LASTNAME}
                                required
                            />
                        )}
                    </FastField>
                    {viewDateOfBirth ?
                        <FastField name="social_security_number">
                            {() => (
                                // <Input
                                //     name="social_security_number"
                                //     type="text"
                                //     value={values.social_security_number || ''}
                                //     onBlur={handleBlur}
                                //     onChange={handleChange}
                                //     error={touched?.social_security_number && errors.social_security_number}
                                //     label={strings.dateOfBirthLabel}
                                //     required
                                // />
                                // <DatePicker
                                //     initialDate={values.social_security_number}
                                //     onChange={(date) => {
                                //         setFieldTouched('social_security_number');
                                //         setFieldValue('social_security_number', date || undefined)
                                //     }}
                                //     inputProps={{
                                //         label: strings.dateOfBirthLabel,
                                //         required: requiredDateOfBirth,
                                //         error: touched?.social_security_number && errors.social_security_number,
                                //     }}
                                // />
                                <CalendarSelect
                                    selectedDate={values.social_security_number}
                                    onChange={(date) => {
                                        setFieldTouched('social_security_number');
                                        setFieldValue('social_security_number', date || undefined)
                                    }}
                                    inputProps={{
                                        label: strings.dateOfBirthLabel,
                                        required: requiredDateOfBirth,
                                        error: touched?.social_security_number && errors.social_security_number,
                                    }}
                                />
                            )}
                        </FastField> : <></>}
                    <FastField name="email">
                        {() => (
                            <Input
                                name="email"
                                type="text"
                                value={values.email || ''}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched?.email && errors.email}
                                required
                                label={strings.Email.toUpperCase()}
                            />
                        )}
                    </FastField>
                    {viewPersonalID ? <FastField name="personal_id">
                        {() => (
                            <Input
                                name="personal_id"
                                value={values.personal_id || ''}
                                required={requiredPersonalID}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched?.personal_id && errors?.personal_id}
                                label={strings.PersonalID_with_format.toUpperCase()}
                                placeholder={strings.PersonalID_with_format.toUpperCase()}
                            />
                        )}</FastField> : <></>}
                    {viewPhone ? <FastField name="phone_number">
                        {() => (
                            <PhoneSelect
                                value={values.phone_number}
                                countryValue={findCountryByCode(values.country_code)}
                                required={requiredPhone}
                                onChangeCountry={(value) => {
                                    setFieldTouched('country_code');
                                    setFieldValue('country_code', value?.code);
                                }}
                                onChange={(number) => {
                                    setFieldTouched('phone_number');
                                    setFieldValue('phone_number', number);
                                }}
                                error={touched?.phone_number && errors.phone_number}
                                countryError={touched?.country_code && errors.country_code}
                            />
                        )}
                    </FastField> : <></>}
                    {viewOccupation ? <FastField name="occupation">
                        {() => (
                            <Input
                                name="occupation"
                                type="text"
                                value={values.occupation || ''}
                                required={requiredOccupation}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched?.occupation && errors.occupation}
                                label={`${strings.Occupation}`.toUpperCase()}
                            />
                        )}
                    </FastField> : <></>}
                    {viewStreetAddress ? <FastField name="street_address">
                        {() => (
                            <Input
                                name="street_address"
                                type="text"
                                value={values.street_address || ''}
                                required={requiredStreetAddress}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched?.street_address && errors.street_address}
                                label={`${strings.StreetAddress}`.toUpperCase()}
                            />
                        )}
                    </FastField> : <></>}
                    {viewCity ? <FastField name="city">
                        {() => (
                            <Input
                                name="city"
                                type="text"
                                value={values.city || ''}
                                required={requiredCity}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched?.city && errors.city}
                                label={strings.City}
                            />
                        )}
                    </FastField> : <></>}
                    {viewZipcode ? <FastField name="zip_code">
                        {() => (
                            <Input
                                name="zip_code"
                                type="text"
                                value={values.zip_code || ''}
                                required={requiredZipcode}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched?.zip_code && errors.zip_code}
                                label={strings.ZipCode}
                            />
                        )}
                    </FastField> : <></>}
                    {viewState ? <FastField name="state">
                        {() => (
                            <Input
                                name="state"
                                type="text"
                                value={values.state || ''}
                                required={requiredState}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched?.state && errors.state}
                                label={strings.State}
                            />
                        )}
                    </FastField> : <></>}
                    {viewCountry ? <FastField name="country">
                        {() => (
                            <CountrySelect
                                required={requiredCountry}
                                onChange={(value) => {
                                    if (!value?.name) return;
                                    setFieldTouched('country');
                                    setFieldValue('country', value?.name);
                                }}
                                error={touched?.country && errors.country}
                            />
                        )}
                    </FastField> : <></>}

                    {values?.extra?.map((field, index) => {
                        const hasTouch = getIn(touched, `extra.${index}.value`);
                        const hasError = getIn(errors, `extra.${index}.value`);

                        return <FastField name={`extra.${index}.value`} key={values.extra[index].id}>
                            {() => (
                                <Input
                                    name={`extra.${index}.value`}
                                    type="text"
                                    value={values.extra[index].value || ''}
                                    required={values.extra[index].required}
                                    onChange={(e) => setFieldValue(`extra.${index}.value`, e.target.value)}
                                    onBlur={() => setFieldTouched(`extra.${index}.value`)}
                                    error={hasTouch && hasError}
                                    label={values.extra[index].name}
                                />
                            )}
                        </FastField>;
                    })}
                    <ServerError className="col-span-2" error={errors.server} />
                </div>
                <RegistrationPortalConsent />
                <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => previous()}
                        disabled={isSubmitting || isValidating}
                    >{strings.PREVIOUS}</Button>
                    <Button
                        loading={isSubmitting || isValidating}
                        fullWidth
                        onClick={async () => await handleSubmit()}
                    >{nextPageTitle}</Button>
                </div>
            </div>
        </RegistrationCard>
    );
}

export default RegistrationPortal2;