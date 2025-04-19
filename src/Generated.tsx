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
} from "date-fns";

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

interface DateRangePickerProps {
  initialDateRange?: DateRange;
  onChange?: (dateRange: DateRange) => void;
  numberOfMonths?: 2 | 3;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialDateRange = { startDate: null, endDate: null },
  onChange,
  numberOfMonths = 2,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pickerType, setPickerType] = useState<"month" | "year" | null>(null);

  const handleDateClick = (day: Date) => {
    const newDateRange = { ...dateRange };
    if (!dateRange.startDate || dateRange.endDate) {
      newDateRange.startDate = day;
      newDateRange.endDate = null;
    } else {
      newDateRange.endDate =
        day > dateRange.startDate ? day : dateRange.startDate;
      newDateRange.startDate =
        day > dateRange.startDate ? dateRange.startDate : day;
    }

    setDateRange(newDateRange);
    onChange?.(newDateRange);

    if (newDateRange.startDate && newDateRange.endDate) {
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const renderMonthGrid = (selectedMonth: Date) => {
    const months = Array.from(
      { length: 12 },
      (_, i) => new Date(selectedMonth.getFullYear(), i, 1)
    );

    return (
      <div className="grid grid-cols-4 gap-2 p-4 bg-white rounded shadow">
        {months.map((monthDate, idx) => (
          <button
            key={idx}
            className={`p-2 rounded ${
              monthDate.getMonth() === selectedMonth.getMonth()
                ? "bg-purple-600 text-white"
                : "hover:bg-purple-100"
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
    const years = Array.from({ length: 21 }, (_, i) => startYear + i);

    return (
      <div className="grid grid-cols-4 gap-2 p-4 bg-white rounded shadow">
        {years.map((year) => (
          <button
            key={year}
            className={`p-2 rounded ${
              year === currentMonth.getFullYear()
                ? "bg-purple-600 text-white"
                : "hover:bg-purple-100"
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

  const renderHeader = (month: Date) => (
    <div className="flex justify-center items-center mb-4">
      <h2 className="text-lg font-semibold">
        <span
          className="cursor-pointer hover:text-purple-600 mr-1"
          onClick={() => setPickerType("month")}>
          {format(month, "MMMM")}
        </span>
        <span
          className="cursor-pointer hover:text-purple-600"
          onClick={() => setPickerType("year")}>
          {format(month, "yyyy")}
        </span>
      </h2>
    </div>
  );

  const renderDaysOfWeek = () => {
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return (
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-px">
        {dates.map((day, i) => {
          const isStart =
            dateRange.startDate && isSameDay(day, dateRange.startDate);
          const isEnd = dateRange.endDate && isSameDay(day, dateRange.endDate);
          const inRange = isInRange(day);
          const isCurrentMonth = isSameMonth(day, month);

          return (
            <button
              key={i}
              className={`h-8 w-8 flex items-center justify-center text-sm
                ${isCurrentMonth ? "hover:bg-purple-100" : "text-gray-400"}
                ${isStart || isEnd ? "bg-purple-600 text-white" : ""}
                ${inRange ? "bg-purple-200" : ""}`}
              onClick={() => isCurrentMonth && handleDateClick(day)}
              onMouseEnter={() => isCurrentMonth && setHoverDate(day)}
              onMouseLeave={() => setHoverDate(null)}
              disabled={!isCurrentMonth}>
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    );
  };

  const isInRange = (day: Date) => {
    if (!dateRange.startDate) return false;
    if (dateRange.endDate) {
      return isWithinInterval(day, {
        start: dateRange.startDate,
        end: dateRange.endDate,
      });
    }
    return (
      hoverDate &&
      isWithinInterval(day, {
        start: dateRange.startDate,
        end: hoverDate,
      })
    );
  };

  const monthsToDisplay = Array.from({ length: numberOfMonths }, (_, i) =>
    addMonths(currentMonth, i)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded-md">
        {dateRange.startDate && dateRange.endDate
          ? `${format(dateRange.startDate, "MM/dd/yyyy")} - ${format(
              dateRange.endDate,
              "MM/dd/yyyy"
            )}`
          : "Select date range"}
      </button>

      {isOpen && (
        <div className="absolute mt-2 p-4 bg-white border rounded-lg shadow-lg z-50">
          {pickerType === "month" ? (
            renderMonthGrid(currentMonth)
          ) : pickerType === "year" ? (
            renderYearGrid(currentMonth.getFullYear())
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="px-2 hover:text-purple-600">
                  ←
                </button>
                <div className="font-semibold">
                  {format(monthsToDisplay[0], "MMM yyyy")} -{" "}
                  {format(
                    monthsToDisplay[monthsToDisplay.length - 1],
                    "MMM yyyy"
                  )}
                </div>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="px-2 hover:text-purple-600">
                  →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {monthsToDisplay.map((month, index) => (
                  <div key={index}>
                    {renderHeader(month)}
                    {renderDaysOfWeek()}
                    {renderCells(month)}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => {
                setDateRange({ startDate: null, endDate: null });
                onChange?.({ startDate: null, endDate: null });
              }}
              className="text-sm text-red-500 hover:text-red-700">
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
