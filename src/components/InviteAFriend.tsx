import { Formik } from "formik";
import { toast } from "react-toastify";
import api from "../configs/api";
import strings from "../lang/Lang";
import ServerError from "../partials/Error/ServerError";
import FormikErrorFocus from "../partials/FormikErrorFocus/FormikErrorFocus";
import { validateInviteAFriendStore } from "../validations";
import Card from "./card";
import Input from "./form/Input";
import Heading from "./heading/Heading";
import recommendImage from '../images/bg/recommend.svg';
import Button from "./form/Button";


export interface InviteAFriendProps {

}

export interface IInviteAFriendValues {
    email: string,
    lang?: string,
    server?: string,
}

const InviteAFriend: React.FC<InviteAFriendProps> = () => {

    return (
        <div>
            <Heading text={strings.RecommendMeridiq} variant="headingTitle" className="mb-4" />
            <div className="">
                <Formik<IInviteAFriendValues>
                    initialValues={{
                        email: '',
                        lang: strings.getLanguage(),
                    }}
                    onSubmit={(values, { resetForm, setErrors, setSubmitting }) => {

                        fetch(api.invite, {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'X-App-Locale': strings.getLanguage(),
                            },
                            credentials: 'include',
                            body: JSON.stringify(values),
                        })
                            .then((response) => response.json())
                            .then(async (data) => {
                                setSubmitting(false);
                                if (data.status === '1') {
                                    resetForm();
                                    toast.success(data.message || 'Thanks for your response.');
                                } else {
                                    setErrors({
                                        server: data.message || 'server error, contact admin.',
                                    });
                                }
                            });
                    }}
                    validate={validateInviteAFriendStore}
                >{({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError, submitForm, handleChange, handleBlur }) => (
                    <Card className="space-y-6 md:py-12">
                        <FormikErrorFocus />
                        <img src={recommendImage} alt="" className='mt-2 mb-10 block px-8 mx-auto' />
                        <p className="text-mediumGray text-sm text-center max-w-4xl mx-auto">{strings.RecommendMessage1}</p>
                        <p className="text-mediumGray text-sm text-center max-w-4xl mx-auto">{strings.RecommendMessage2}</p>
                        <div className="flex space-x-3 items-start justify-center pt-6">
                            <Input
                                placeholder={strings.EmailAddress}
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched.email && errors.email}
                            />
                            <Button type="submit" onClick={submitForm} loading={isSubmitting || isValidating}>
                                <span className="hidden md:block">{strings.invite_a_friend_btn}</span>
                                <span className="md:hidden">{strings.send}</span>
                            </Button>
                        </div>

                        <ServerError error={errors?.server} />
                    </Card>
                )}
                </Formik>
            </div>
        </div>
    );
}

export default InviteAFriend;