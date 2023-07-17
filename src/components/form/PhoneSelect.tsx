import countries, { Country, findCountryByAbbr } from "@configs/countries";
import { Combobox, Transition } from "@headlessui/react";
import strings from "@lang/Lang";
import { Ref, useEffect, useRef, useState } from 'react';
import Error from "./Error";
import Label from "./Label";

export interface PhoneSelectProps {
    onChangeCountry: (val?: Country) => void,
    onChange?: (phoneNo: string) => void,
    countryValue?: Country,
    value: string,
    disabled?: boolean
    required?: boolean
    error?: string | false,
    countryError?: string | false,
}

const PhoneSelect = ({
    onChange = () => {},
    value,
    onChangeCountry,
    countryValue,
    disabled,
    required,
    error,
    countryError,
}: PhoneSelectProps) => {

    const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(countryValue)

    useEffect(() => {
        if (selectedCountry) onChangeCountry(selectedCountry)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCountry])

    const [query, setQuery] = useState('')
    const [phoneNo, setPhoneNo] = useState(value);
    const ref = useRef<HTMLInputElement>();
    const list = query === ''
        ? countries
        : countries.filter((country) => {
            const isInCode = country.code.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
            const isInName = country.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
            return isInCode || isInName
        })
    let className = 'form-input form-select block py-2.5 px-3.5 w-24 rounded-[4px] focus:ring-0 bg-transparent border-0 disabled:text-gray-500  text-dimGray dark:text-white  bg-white dark:bg-dimGray   placeholder:text-mediumGray dark:placeholder:text-gray-600 '
    let inputClassName = 'form-input border-none focus:border-0 focus:ring-0 rounded-[4px] block py-2.5 px-3.5 w-full border-0 hover:border-0 text-dimGray dark:text-white bg-white dark:bg-dimGray  placeholder:text-mediumGray dark:placeholder:text-gray-600 '

    function onFocusPhoneInput() {
        if (!phoneNo.length && !selectedCountry) {
            const loc = Intl.DateTimeFormat().resolvedOptions().locale.slice(-2);
            const country = findCountryByAbbr(loc)
            if (country) {
                setSelectedCountry(country)
            }
        }
    }

    return (
        <div className="relative">
            <Combobox disabled={disabled} value={selectedCountry ? selectedCountry : countryValue} onChange={setSelectedCountry}>
                <div className="relative">
                    <Label label={strings.PhoneNumber} required={required} />
                    <div className="flex rounded-[4px] border border-lightPurple focus-within:border-primary dark:border-gray-700">
                        <Combobox.Button className="w-24 rounded-[4px] p-0 border-0">
                            <Combobox.Input
                                autoComplete="new-password"
                                className={className}
                                onFocus={onFocusPhoneInput}
                                displayValue={(item?: Country) => item?.code ? `+${item?.code}` : ""}
                                placeholder={"+1"}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                        </Combobox.Button>
                        <Transition
                            className="absolute mt-1 max-h-60 soft-searchbar z-50 w-52 overflow-auto rounded-[4px] bg-white dark:bg-black py-1 text-base shadow-lg ring-1 dark:text-white ring-black ring-opacity-5 focus:outline-none sm:text-sm"
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
                                            <p className={`pl-3 flex w-full items-center space-x-1 ${selected ? "text-primary dark:text-primaryLight dark:bg-dimGray font-semibold" : ""}`}>
                                                <span className="flex-grow">{country.name}</span>
                                                <span className="whitespace-nowrap">+{country.code}</span>
                                            </p>
                                        }
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Transition>
                        <input
                            className={inputClassName}
                            value={phoneNo}
                            onChange={(e) => {
                                onFocusPhoneInput()
                                setPhoneNo(e.target.value)
                                onChange(e.target.value)
                            }}
                            onFocus={onFocusPhoneInput}
                            ref={ref as Ref<HTMLInputElement>}
                            onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');
                            }}
                        />
                    </div>
                </div>
            </Combobox>

            <Error error={countryError} />
            <Error error={error} />
        </div>
    );
}


export default PhoneSelect;