import countries, { Country } from "@configs/countries";
import { Combobox, Transition } from "@headlessui/react";
import strings from "@lang/Lang";
import { memo, useEffect, useState } from "react";
import Error from "./Error";
import Label from "./Label";

export interface CountrySelectProps {
  onChange: (val?: Country) => void,
  defaultValue?: Country
  disabled?: boolean
  required?: boolean
  error?: string | false
}

const CountrySelect = ({
  onChange,
  defaultValue = undefined,
  disabled,
  required,
  error,
}: CountrySelectProps) => {

  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(defaultValue)

  useEffect(() => {
    if (selectedCountry) onChange(selectedCountry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry])

  const [query, setQuery] = useState('')

  const list = query === ''
    ? countries
    : countries.filter((country) => country.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')))

  let className = 'form-input form-select block py-2.5 px-3.5 w-full rounded-[4px] bg-transparent border-lightPurple disabled:text-gray-500 dark:border-gray-700 text-dimGray dark:text-white hover:border-mediumGray dark:hover:border-slate-700 bg-white dark:bg-dimGray focus:border-primary focus:ring-1 placeholder:text-mediumGray dark:placeholder:text-gray-600 '
  if (error) className += 'border-red-500 text-red-500 focus:text-black '

  return (
    <div className="relative">
      <Combobox value={selectedCountry} onChange={setSelectedCountry} disabled={disabled}>
        <div className="relative">
          <Label label={strings.Country} required={required} />
          <Combobox.Button className="w-full rounded-[4px] p-0 border-0">
            <Combobox.Input
              autoComplete="new-password"
              className={className}
              displayValue={(item?: Country) => item?.name ?? ""}
              placeholder={strings.Country}
              onChange={(event) => setQuery(event.target.value)}
            />
          </Combobox.Button>
          <Transition
            className="absolute mt-1 max-h-60 soft-searchbar z-50 w-full overflow-auto rounded-[4px] bg-white dark:bg-black py-1 text-base shadow-lg ring-1 dark:text-white ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            enter="transition-all duration-300"
            enterFrom="top-[90%] opacity-0"
            enterTo="top-full opacity-100"
            leave="transition-all ease-out duration-75"
            leaveFrom="top-full opacity-100"
            leaveTo="top-[90%] opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options>
              {list.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4">
                  {strings.no_data}
                </div>
              ) : list.map(country => (
                <Combobox.Option
                  key={country.abbr}
                  value={country}
                  className={({ active, selected }) => `relative cursor-default flex select-none py-2 pr-4 ${selected ? 'dark:bg-dimGray dark:text-primaryLight' : active ? 'bg-purpleGray text-primary dark:text-primaryLight dark:bg-dimGray' : ''}`}
                >
                  {({ selected }) =>
                    <p className={`pl-3 flex space-x-1 ${selected ? "text-primary dark:text-primaryLight dark:bg-dimGray font-semibold" : ""}`}>
                      {country.name} ({country.abbr}) +{country.code}
                    </p>
                  }
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      <Error error={error} />
    </div>
  );
}


export default memo(CountrySelect);