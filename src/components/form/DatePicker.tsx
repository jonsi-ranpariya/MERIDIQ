import OGDatePicker, { Day, DayValue } from "@amir04lm26/react-modern-calendar-date-picker";
import strings from "@lang/Lang";
import dayjs from "dayjs";
import { memo, useEffect, useState } from "react";
import "../../css/Datepicker.css";
import Input, { InputProps } from "./Input";

export interface DatePickerProps {
  initialDate?: string
  onChange: (val: string) => void
  inputProps?: InputProps
  maxToday?: boolean,
}

const DatePicker: React.FC<DatePickerProps> = ({
  initialDate,
  onChange,
  maxToday,
  inputProps,
}) => {

  const [selectedDate, setSelectedDate] = useState<DayValue>(null)
  const [selectedDateString, setSelectedDateString] = useState<string>(formatDate(selectedDate))

  const error = selectedDateString.trim().length
    ? (!/^((20[012]\d|19\d\d))-((0[1-9])|(1[012]))-((0[1-9])|([12][0-9])|(3[01]))$/i.test(selectedDateString))
      ? strings.please_provide_valid_date_format
      : false
    : false

  useEffect(() => {
    if (!initialDate) return
    const date = dayjs(initialDate)
    if (!date.isValid()) return
    const dayObj = formatDate4DatePicker(date) as Day
    if (selectedDate === dayObj) return;
    setSelectedDate(dayObj)
    setSelectedDateString(formatDate(dayObj))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDate])

  function onChangeInside(value: DayValue) {
    if (!value) return
    setSelectedDate(value)
    setSelectedDateString(formatDate(value))
    onChange(formatDate(value))
  }

  const todayy = dayjs(new Date())
  const today = maxToday ? formatDate4DatePicker(todayy) as Day : undefined

  return (
    <OGDatePicker
      value={selectedDate}
      onChange={onChangeInside}
      inputPlaceholder={strings.Date}
      shouldHighlightWeekends
      wrapperClassName="w-full"
      calendarClassName="responsive-calendar"
      colorPrimary="#5551CE"
      maximumDate={today}
      renderInput={({ ref }) => (
        <Input
          suffix={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          onChange={(ev) => {
            const val = ev.currentTarget.value.replace(/[^0-9-]/g, '').replace(/(\..*?)\..*/g, '$1');
            setSelectedDateString(val)
            const date = dayjs(val)
            if (!date.isValid()) return
            const dayObj = formatDate4DatePicker(date) as Day
            if (selectedDate === dayObj) return;
            setSelectedDate(dayObj)
          }}
          value={selectedDateString}
          {...inputProps}
          error={error ? error : inputProps?.error}
          ref={ref}
        />
      )}
    />
  );

  function formatDate(val: DayValue) {
    return val ? `${val.year}-${('0' + val.month).slice(-2)}-${('0' + val.day).slice(-2)}` : ''
  }

  function formatDate4DatePicker(date: dayjs.Dayjs) {
    const year = date.year() < (new Date().getFullYear() - 99) ? new Date().getFullYear() : date.year();
    return { day: date.date(), month: date.month() + 1, year }
  }

}

export default memo(DatePicker);