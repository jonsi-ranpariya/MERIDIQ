import { Formik } from "formik";
import { toast } from "react-toastify";
import api from "../configs/api";
import { heic2convert } from "../helper";
import useAuth from "../hooks/useAuth";
import useTranslation from "../hooks/useTranslation";
import strings from "../lang/Lang";
import ServerError from "../partials/Error/ServerError";
import FormikErrorFocus from "../partials/FormikErrorFocus/FormikErrorFocus";
import File from "../partials/MaterialFile/File";
import Card from "../partials/Paper/PagePaper";
import { validateSupportStore } from "../validations";
import Button from "./form/Button";
import Input from "./form/Input";
import TextArea from "./form/TextArea";
import Heading from "./heading/Heading";

export interface SupportProps {

}

export interface ISupportValues {
    subject: string,
    message: string,
    email: string,
    file?: File,
    server?: string,
}

const Support: React.FC<SupportProps> = () => {
    const { user } = useAuth();
    const [language] = useTranslation();

    return (
        <div className="">
            <Heading text={strings.Support} variant="bigTitle" className="mb-4" />
            <Formik<ISupportValues>
                initialValues={{
                    subject: "",
                    message: "",
                    email: user?.email || "",
                }}
                onSubmit={(values, { resetForm, setErrors, setSubmitting }) => {
                    const formData = new FormData();
                    formData.append("subject", values.subject);
                    formData.append("message", values.message);
                    formData.append("email", values.email);

                    if (values.file) {
                        formData.append("file", values.file);
                    }

                    fetch(api.supportStore, {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "X-App-Locale": language,
                        },
                        credentials: "include",
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then(async (data) => {
                            setSubmitting(false);
                            if (data.status === "1") {
                                resetForm();
                                toast.success(data.message || "Thanks for your response.");
                            } else {
                                setErrors({
                                    server: data.message || "server error, contact admin.",
                                });
                            }
                        });
                }}
                validate={validateSupportStore}
            >
                {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError, handleChange, handleBlur }) => (
                    <Card className="md:py-9 md:px-8">
                        <FormikErrorFocus />
                        <p className="text-gray-500 text-sm mb-6">{strings.support_subtext}</p>
                        <div className="space-y-6 max-w-xl">
                            <Input
                                label={strings.SUBJECT}
                                required
                                name="subject"
                                value={values.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.subject && errors.subject}
                            />
                            <TextArea
                                rows={8}
                                label={strings.MESSAGE}
                                required
                                name="message"
                                value={values.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.message && errors.message}
                            />

                            <File
                                onChange={async (e) => {
                                    if (!e.target.files) return;
                                    let file: File | Blob | null = e.target.files[0];

                                    if (file && !file.type) {
                                        file = await heic2convert(file);
                                    }

                                    await setFieldValue("file", file);
                                    setFieldTouched("file");
                                }}
                                name="file"
                                error={touched?.file && Boolean(errors.file)}
                                helperText={touched?.file && errors.file}
                            />

                            <ServerError error={errors?.server} />
                            <div className="text-center">
                                <Button
                                    type="submit"
                                    onClick={() => handleSubmit()}
                                    loading={isSubmitting || isValidating}
                                >
                                    {strings.SupportSubmit}
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </Formik>
        </div>
    );
}

export default Support;