import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  getWeek,
} from "date-fns";

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export interface DateRangePickerProps {
  initialDateRange?: DateRange;
  onChange?: (dateRange: DateRange) => void;
  numberOfMonths?: 2 | 3; // Only allow 2 or 3 months
  showWeekNumbers?: boolean; // Optional prop to show week numbers
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Optional prop to set the start day of the week (0 = Sunday, 1 = Monday, etc.)
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialDateRange = { startDate: null, endDate: null },
  onChange,
  numberOfMonths = 2,
  showWeekNumbers = false,
  weekStartsOn = 0, // Default to Sunday
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pickerType, setPickerType] = useState<"month" | "year" | null>(null);

  const handleDateClick = (day: Date) => {
    const newDateRange = { ...dateRange };

    if (!dateRange.startDate || dateRange.endDate) {
      // Set start date if not set or if both dates are already set (start new selection)
      newDateRange.startDate = day;
      newDateRange.endDate = null;
    } else {
      // If start date is before clicked day, set end date
      if (day > dateRange.startDate) {
        newDateRange.endDate = day;
      } else {
        // If clicked before start date, swap dates
        newDateRange.endDate = newDateRange.startDate;
        newDateRange.startDate = day;
      }
    }

    setDateRange(newDateRange);
    if (onChange && newDateRange.startDate && newDateRange.endDate) {
      onChange(newDateRange);
    }

    // Close the picker if both dates are selected
    if (newDateRange.startDate && newDateRange.endDate) {
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const handleMouseEnter = (day: Date) => {
    setHoverDate(day);
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderMonthGrid = (selectedMonth: Date) => {
    const months = Array.from(
      { length: 12 },
      (_, i) => new Date(selectedMonth.getFullYear(), i, 1)
    );

    return (
      <div className="absolute top-24 w-56 h-56 grid grid-cols-3 gap-2 p-4 bg-white rounded shadow z-20">
        {months.map((monthDate, idx) => (
          <button
            key={idx}
            className={`p-2 rounded ${
              monthDate.getMonth() === selectedMonth.getMonth()
                ? "bg-purple-600 text-white"
                : "hover:bg-purple-300"
            }`}
            onClick={() => {
              setCurrentMonth(monthDate);
              setPickerType(null);
            }}>
            {format(monthDate, "MMM")}
          </button>
        ))}
      </div>
    );
  };

  const renderYearGrid = (selectedYear: number) => {
    const startYear = selectedYear - 10;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="absolute w-56 h-56 top-24 grid grid-cols-3 gap-2 p-4 bg-white rounded shadow z-20">
        {years.map((year) => (
          <button
            key={year}
            className={`p-2 rounded ${
              year === currentMonth.getFullYear()
                ? "bg-purple-600 text-white"
                : "hover:bg-purple-300"
            }`}
            onClick={() => {
              const newDate = new Date(currentMonth);
              newDate.setFullYear(year);
              setCurrentMonth(newDate);
              setPickerType("month");
            }}>
            {year}
          </button>
        ))}
      </div>
    );
  };

  const renderHeader = (month: Date) => {
    return (
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-lg font-semibold">
          <span
            className="relative cursor-pointer hover:text-purple-600 mr-1"
            onClick={() => {
              if (pickerType === null) setPickerType("month");
              else setPickerType(null);
            }}>
            {format(month, "MMMM")}
          </span>
          <span
            className="relative cursor-pointer hover:text-purple-600"
            onClick={() => {
              if (pickerType === null) setPickerType("year");
              else setPickerType(null);
            }}>
            {format(month, "yyyy")}
          </span>
        </h2>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const orderedWeekDays = [
      ...weekDays.slice(weekStartsOn),
      ...weekDays.slice(0, weekStartsOn),
    ];
    return (
      <div
        className={`grid ${
          showWeekNumbers ? "grid-cols-8" : "grid-cols-7"
        } mb-2`}>
        {showWeekNumbers && (
          <div className="text-center text-sm font-medium text-gray-500 py-1">
            #
          </div>
        )}
        {orderedWeekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn });
    const endDate = endOfWeek(monthEnd, { weekStartsOn });

    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const weeks = [];

    // Split dates into weeks
    while (dateRange.length > 0) {
      weeks.push(dateRange.splice(0, 7));
    }

    return (
      <div
        className={`grid ${
          showWeekNumbers ? "grid-cols-8" : "grid-cols-7"
        } gap-y-1`}>
        {weeks.map((weekDates, weekIndex) => {
          const weekNumber = getWeek(weekDates[0], { weekStartsOn });
          return (
            <React.Fragment key={weekIndex}>
              {showWeekNumbers ? (
                <div className="h-8 flex items-center justify-center text-xs text-gray-500 border-r">
                  {weekNumber}
                </div>
              ) : null}
              {weekDates.map((day, i) => renderCell(day, i, month))}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const isInRange = (day: Date) => {
    if (!dateRange.startDate) return false;
    if (dateRange.startDate && dateRange.endDate) {
      return isWithinInterval(day, {
        start: dateRange.startDate,
        end: dateRange.endDate,
      });
    }
    if (dateRange.startDate && hoverDate && hoverDate > dateRange.startDate) {
      return isWithinInterval(day, {
        start: dateRange.startDate,
        end: hoverDate,
      });
    }
    return false;
  };

  const renderCell = (day: Date, key: number, currentMonthView: Date) => {
    const isStartDate =
      dateRange.startDate && isSameDay(day, dateRange.startDate);
    const isEndDate = dateRange.endDate && isSameDay(day, dateRange.endDate);
    const isToday = isSameDay(day, new Date());
    const isCurrentMonth = isSameMonth(day, currentMonthView);
    const inDateRange = isInRange(day);

    let classes = "h-8 w-8 flex items-center justify-center";

    if (!isCurrentMonth) {
      classes += " hidden bg-white";
    } else {
      classes += " hover:bg-purple-100 ";
    }

    if (isToday) {
      classes += "font-bold ";
    }

    if (isStartDate) {
      classes += " bg-purple-600 text-white rounded-tl-lg rounded-bl-lg";
    } else if (isEndDate) {
      classes += " bg-purple-600 text-white rounded-tr-lg rounded-br-lg";
    } else if (inDateRange) {
      classes += " bg-purple-200 ";
    }

    return (
      <div
        key={key}
        className={`relative flex items-center justify-center  ${
          inDateRange && !isStartDate && !isEndDate ? "" : ""
        }`}>
        <button
          type="button"
          className={classes}
          onClick={() => isCurrentMonth && handleDateClick(day)}
          onMouseEnter={() => isCurrentMonth && handleMouseEnter(day)}
          onMouseLeave={handleMouseLeave}
          disabled={!isCurrentMonth}>
          {format(day, "d")}
        </button>
      </div>
    );
  };

  const toggleDatepicker = () => {
    setIsOpen(!isOpen);
  };

  const formatDisplayDate = () => {
    if (dateRange.startDate && dateRange.endDate) {
      return `${format(dateRange.startDate, "dd/MM/yyyy")} - ${format(
        dateRange.endDate,
        "dd/MM/yyyy"
      )}`;
    }
    if (dateRange.startDate) {
      return `${format(dateRange.startDate, "dd/MM/yyyy")} - Select end date`;
    }
    return "Select date range";
  };

  // Generate an array of month dates to display
  const monthsToDisplay = Array.from({ length: numberOfMonths }, (_, i) =>
    addMonths(currentMonth, i)
  );

  return (
    <div className="relative inline-block w-full max-w-xl">
      <div
        className="w-full p-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
        onClick={toggleDatepicker}>
        <span className="text-gray-700">{formatDisplayDate()}</span>
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {isOpen && (
        // (pickerType === "month" ? (
        //   renderMonthGrid(currentMonth)
        // ) : pickerType === "year" ? (
        //   renderYearGrid(currentMonth.getFullYear())
        // ) :
        <div
          className={`absolute z-10 mt-2 p-4 bg-white border border-gray-200 rounded-md shadow-lg ${
            numberOfMonths === 3 ? "w-full md:w-auto" : "w-full md:w-auto"
          }`}>
          {pickerType === "month" && renderMonthGrid(currentMonth)}
          {pickerType === "year" && renderYearGrid(currentMonth.getFullYear())}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-md hover:bg-gray-100"
              type="button">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-lg font-semibold">
              {format(monthsToDisplay[0], "MMM yyyy")} -{" "}
              {format(monthsToDisplay[numberOfMonths - 1], "MMM yyyy")}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-md hover:bg-gray-100"
              type="button">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div
            className={`grid ${
              numberOfMonths === 3
                ? "grid-cols-1 md:grid-cols-3 gap-4"
                : "grid-cols-1 md:grid-cols-2 gap-4"
            }`}>
            {monthsToDisplay.map((month, index) => (
              <div key={index} className="month-calendar">
                {renderHeader(month)}
                {renderDaysOfWeek()}
                {renderCells(month)}
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-3 flex justify-between">
            <button
              onClick={() => {
                setDateRange({ startDate: null, endDate: null });
                if (onChange) onChange({ startDate: null, endDate: null });
              }}
              className="text-sm text-red-500 hover:text-red-700"
              type="button">
              Clear
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              type="button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
