import Error from "@components/form/Error";
import IconButton from "@components/form/IconButton";
import Input, { InputProps } from "@components/form/Input";
import { useCalendar } from "@h6s/calendar";
import { Popover, Transition } from "@headlessui/react";
import strings from "@lang/Lang";
import ChevronIcon from "@partials/Icons/Chevron";
import customParseFormat from 'dayjs/plugin/customParseFormat';


import dayjs from "dayjs";
import { useEffect, useState } from "react";

export interface CalendarSelectProps {
  disabled?: boolean
  onChange: (date: string) => void
  selectedDate?: string
  inputProps?: InputProps
  maxToday?: boolean
  disabledDays?: string[],
  error?: string | false
}
dayjs.extend(customParseFormat)
const CalendarSelect: React.FC<CalendarSelectProps> = ({
  // label,
  disabled,
  error,
  inputProps,
  onChange,
  selectedDate,
  maxToday,
  disabledDays
}) => {

  const maxDay = maxToday ? dayjs() : undefined
  const [innerSelectedDate, setInnerSelectedDate] = useState<string>(selectedDate || '')

  const insideError = innerSelectedDate.trim().length
    ? (!/^((20[012]\d|19\d\d))-((0[1-9])|(1[012]))-((0[1-9])|([12][0-9])|(3[01]))$/i.test(innerSelectedDate))
      ? strings.please_provide_valid_date_format
      : false
    : false

  const { body, month, headers, cursorDate, navigation: { toPrev, toNext, setDate } } = useCalendar({ defaultWeekStart: 1 })
  const day = dayjs(cursorDate)

  useEffect(() => {
    if (!selectedDate) return
    const date = dayjs(selectedDate, 'YYYY-MM-DD')
    if (!date.isValid()) return
    setDate(date.toDate());
    if (selectedDate === innerSelectedDate) return;
    setInnerSelectedDate(selectedDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  const onInnerChange = (value: Date) => {
    setDate(value);

    const date = dayjs(value).format("YYYY-MM-DD");
    onChange(date);
    setInnerSelectedDate(date);
  }

  return (
    <div className="">
      <Popover as="div" className="relative dark:text-white">
        {/* @ts-ignore */}
        <Input
          disabled={disabled}
          value={innerSelectedDate || ""}
          {...inputProps}
          error={insideError ? insideError : error ? error : inputProps?.error}
          onChange={(ev) => {
            const val = ev.currentTarget.value.replace(/[^0-9-]/g, '').replace(/(\..*?)\..*/g, '$1');
            setInnerSelectedDate(val)

            const validDate = dayjs(val, 'YYYY-MM-DD')
            if (!validDate.isValid()) return;
            onInnerChange(validDate.toDate())
          }}
          suffixButton={
            <Popover.Button
              disabled={disabled}
              className="text-sm touch-auto outline-none pointer-events-auto rounded-md p-1.5 text-primary dark:text-primaryLight font-medium hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-50 dark:active:bg-gray-600 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </Popover.Button>
          }
        />
        <Transition
          className="absolute mt-1 p-4 z-50 overflow-auto rounded-[4px] bg-white dark:bg-black text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          enter="transition-all duration-300"
          enterFrom="top-[90%] opacity-0"
          enterTo="top-full opacity-100"
          leave="transition-all ease-out duration-75"
          leaveFrom="top-full opacity-100"
          leaveTo="top-[90%] opacity-0"
        >
          <Popover.Panel className="flex flex-col max-w-min">
            <div className="flex items-center justify-between mb-3">
              <IconButton icon={<ChevronIcon side="left" />} onClick={toPrev} />
              <p className="flex-grow text-center">{day.format("MMMM YYYY")}</p>
              <IconButton icon={<ChevronIcon side="right" />} onClick={toNext} />
            </div>
            <div className="relative">
              <div className="table border-collapse">
                <div className="table-row">
                  {headers.weekDays.map(({ key, value }) => {
                    const week = dayjs(value)
                    return (
                      <div className="table-cell align-middle" key={key}>
                        <p className="text-center opacity-60 mb-2">{week.format("dd")}</p>
                      </div>
                    )
                  })}
                </div>
                {body.value.map(({ key, value }) => {
                  return (
                    <div key={key} className="table-row">
                      {value.map(({ key, value, isCurrentDate }) => {
                        const day = dayjs(value)
                        const date = day.format("D")
                        const sameMonth = day.month() === month
                        const formattedDate = day.format("YYYY-MM-DD");
                        const isDisabled = disabledDays?.includes(formattedDate) || (maxDay && day.isAfter(maxDay))
                        const selected = selectedDate === formattedDate

                        return (
                          <div key={key} className={`table-cell border dark:border-gray-800 align-middle`}>
                            {
                              sameMonth &&
                              <Popover.Button
                                className={`${(selected) && "bg-primary text-white"} ${(isCurrentDate && !selected) ? "bg-primary/20 dark:bg-primaryLight/20" : ""} active:bg-primary/20 dark:active:bg-primaryLight/20 disabled:opacity-50 h-8 w-8 select-none flex justify-center items-center`}
                                disabled={isDisabled}
                                onClick={() => onInnerChange(value)}
                              >
                                <p className="text-center">{date}</p>
                              </Popover.Button>
                            }
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
      <Error error={error} />
    </div>
  );
}

export default CalendarSelect;