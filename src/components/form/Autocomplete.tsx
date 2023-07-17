import { Combobox, Transition } from "@headlessui/react";
import strings from "@lang/Lang";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Error from "./Error";
import { InputProps } from "./Input";

export interface AutocompleteProps<T> {
  options: T[]
  value?: T
  children?: ReactNode
  onChange: (val: T) => void
  displayValue: (val?: T) => string
  filteredValues: (query: string) => T[]
  error?: string | false
  inputProps: InputProps
  renderOption: (option: T) => string
}

const Autocomplete = <T extends unknown>({
  options,
  onChange,
  value,
  displayValue,
  filteredValues,
  error,
  inputProps: { className: inputClassName, ...inputProps },
  renderOption,
}: AutocompleteProps<T>) => {

  const [query, setQuery] = useState('')

  const [selectedValue, setSelectedValue] = useState<T | undefined>(value)

  useEffect(() => {
    if (selectedValue) onChange(selectedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue])

  useEffect(() => {
    setSelectedValue(value)
  }, [value])


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = useMemo(() => query === '' ? options : filteredValues(query), [query, options])

  let className = `form-input block py-2.5 px-3.5 w-full rounded-[4px] bg-transparent border-lightPurple dark:border-gray-700 text-dimGray dark:text-white hover:border-mediumGray dark:hover:border-gray-600 focus:border-primary focus:ring-1 placeholder:text-mediumGray dark:placeholder:text-gray-600`
  if (error) className += 'border-red-500 text-red-500 focus:text-black '

  return (
    <div className="relative">
      <Combobox value={selectedValue} onChange={setSelectedValue}>
        <div className="relative">
          <Combobox.Button className={`w-full form-select bg-transparent rounded dark:bg-dimGray p-0 border-0 ${inputClassName}`}>
            <Combobox.Input
              autoComplete="new-password"
              className={className}
              displayValue={displayValue}
              onChange={(event) => setQuery(event.target.value)}
              {...inputProps}
            />
          </Combobox.Button>
          <Transition
            className="absolute mt-1 max-h-60 z-50 w-full overflow-auto rounded-[4px] bg-white dark:bg-black py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            enter="transition-all duration-300"
            enterFrom="top-[90%] opacity-0"
            enterTo="top-full opacity-100"
            leave="transition-all ease-out duration-75"
            leaveFrom="top-full opacity-100"
            leaveTo="top-[90%] opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options>
              {list.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-white">
                  {strings.no_data}
                </div>
              ) : list.map((option, index) => (
                <Combobox.Option
                  key={`option_${index}`}
                  value={option}
                  className={({ active }) => `relative cursor-default flex select-none py-2 pr-4 ${active ? 'bg-purpleGray text-primary dark:bg-dimGray dark:text-white' : 'text-gray-900 dark:text-white'}`}
                >
                  {({ selected }) =>
                    <p className={`pl-3 flex space-x-1 ${selected ? "text-primary dark:text-primaryLight font-semibold" : ""}`}>
                      {renderOption(option)}
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

export default Autocomplete;