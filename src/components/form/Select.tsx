import { Listbox, Transition } from "@headlessui/react";
import LoadingIcon from "@icons/Loading";
import { ReactNode } from "react";
import Label from "./Label";
import Error from "./Error";

export interface SelectProps {
  children?: ReactNode,
  onChange: (val: string) => void
  value?: string | number
  label?: string
  displayValue: (val?: string | number) => string | number | undefined
  required?: boolean
  disabled?: boolean
  loading?: boolean
  className?: string
  placeholder?: string
  error?: string | false
}

const Select = ({
  children,
  onChange,
  value,
  label,
  displayValue,
  required,
  disabled,
  loading,
  className,
  placeholder,
  error
}: SelectProps) => {

  return (
    <Listbox value={value} onChange={onChange} as="div" className="relative dark:text-white" disabled={disabled}>
      <Label label={label} required={required} />
      <Listbox.Button className={`${className} form-select ${loading && "pl-10"} relative block py-2.5 px-3.5 rounded-[4px] w-full border-lightPurple disabled:text-gray-500 dark:border-gray-700 disabled:cursor-not-allowed dark:text-white text-left dark:hover:border-slate-700 bg-white dark:bg-dimGray focus:border-primary dark:focus:border-primaryLight focus:ring-1 placeholder:text-mediumGray dark:placeholder:text-gray-600`}>
        {loading &&
          <div className="absolute inset-0 flex items-center justify-center w-10 text-primary"><LoadingIcon /></div>
        }
        {value ?
          <span className="block truncate">{displayValue(value)}&nbsp;</span>
          : <span className="text-mediumGray dark:text-gray-600">{placeholder}&nbsp;</span>}
      </Listbox.Button>
      <Transition
        className="absolute mt-1 max-h-60 z-50 w-full overflow-auto rounded-[4px] bg-white dark:bg-black py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        enter="transition-all duration-300"
        enterFrom="top-[90%] opacity-0"
        enterTo="top-full opacity-100"
        leave="transition-all ease-out duration-75"
        leaveFrom="top-full opacity-100"
        leaveTo="top-[90%] opacity-0"
      >
        <Listbox.Options>
          {children}
        </Listbox.Options>
      </Transition>
      <Error error={error} />
    </Listbox>
  );
}

export interface SelectOptionProps {
  children?: ReactNode
  value: string | number
}

const SelectOption: React.FC<SelectOptionProps> = ({
  children,
  value,
}) => {
  return (
    <Listbox.Option
      value={value}
      className={({ active }) => `relative cursor-default flex select-none py-2 pr-4 ${active ? 'bg-purpleGray text-primary dark:bg-dimGray dark:text-white' : 'text-gray-900 dark:text-white'}`}
    >
      {({ selected }) =>
        <p className={`pl-3 flex space-x-1 ${selected ? "text-primary dark:text-primaryLight font-semibold" : ""}`}>
          {children}
        </p>
      }
    </Listbox.Option>
  );
}

Select.Option = SelectOption

export default Select;