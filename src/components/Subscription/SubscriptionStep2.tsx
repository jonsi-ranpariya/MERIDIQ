import Button from "@components/form/Button";
import CountrySelect from "@components/form/CountrySelect";
import { CreditCard } from "@components/form/CreditCard";
import Input from "@components/form/Input";
import { findCountryByName } from "@configs/countries";
import useAuth from "@hooks/useAuth";
import useSubscription from "@hooks/useSubscription";
import strings from "@lang/Lang";

export interface SubscriptionStep2Props {
  upgrade?: boolean
}


const SubscriptionStep2: React.FC<SubscriptionStep2Props> = ({ upgrade }) => {

  const { user } = useAuth()
  const country = findCountryByName(user?.company?.country || '');

  const { formik } = useSubscription();

  const { values, isValidating, handleChange, handleBlur, touched, errors, handleSubmit, isSubmitting } = formik ?? {};

  return (
    <div className="py-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label={strings.Name}
          placeholder={strings.Name}
          value={values?.name}
          name="name"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.name && touched?.name && errors.name}
        />
        <Input
          label={strings.Phone}
          placeholder={strings.Phone}
          value={values?.phone}
          name="phone"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.phone && touched?.phone && errors.phone}
        />
        <Input
          label={strings.CompanyName}
          placeholder={strings.CompanyName}
          value={values?.company_name}
          name="company_name"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.company_name && touched?.company_name && errors?.company_name}
        />
        <Input
          label={strings.Address}
          placeholder={strings.Address}
          value={values?.line1}
          name="line1"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.line1 && touched?.line1 && errors?.line1}
        />
        <Input
          label={strings.City}
          placeholder={strings.City}
          value={values?.city}
          name="city"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.city && touched?.city && errors?.city}
        />
        <Input
          label={strings.ZipCode}
          placeholder={strings.ZipCode}
          value={values?.postal_code}
          name="postal_code"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.postal_code && touched?.postal_code && errors?.postal_code}
        />
        <CountrySelect
          onChange={() => {}}
          defaultValue={country}
          disabled
        />
        <Input
          label={strings.VAT_number}
          placeholder={strings.VAT_number}
          value={values?.vat_number}
          name="vat_number"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.vat_number && touched?.vat_number && errors?.vat_number}
        />
      </div>
      <Input
        label={strings.refercode}
        placeholder={strings.refercode}
        value={values?.refercode}
        name="refercode"
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors?.refercode && touched?.refercode && errors?.refercode}
      />
      <CreditCard
        error={touched?.paymentMethod && errors?.paymentMethod}
      />
      <Button
        fullWidth
        size="big"
        type="submit"
        loading={isSubmitting || isValidating}
        onClick={() => {
          if (handleSubmit) handleSubmit()
        }}
      >
        {strings.continue}
      </Button>
    </div>
  );
}

export default SubscriptionStep2;