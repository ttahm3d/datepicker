import React, { useState } from "react";
import { format } from "date-fns";
import Daterange, { DateRangePickerProps } from "./components/DaterangePicker";

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

const App: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const [options, setOptions] = useState({
    numberOfMonths: 2,
    showWeekNumbers: true,
    weekStartsOn: 1,
    highlightFullWeekOnHover: true,
    defaultToWeekStartAndEndDates: true,
  });

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
    console.log("Date range changed:", newDateRange);
  };

  return (
    <div className="p-4 h-full">
      <h1 className="text-2xl font-bold mb-4">Date Range Picker</h1>
      <section className="grid grid-cols-3 gap-4 min-h-full">
        <div className="bg-gray-200 p-4 flex flex-col gap-4 col-span-1 mb-4 h-full">
          <h1>Options</h1>
          <label>
            Number of Months:
            <select
              value={options.numberOfMonths}
              onChange={(e) =>
                setOptions({ ...options, numberOfMonths: +e.target.value })
              }>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>
          <label>
            Show Week Numbers:
            <input
              type="checkbox"
              checked={options.showWeekNumbers}
              onChange={(e) =>
                setOptions({ ...options, showWeekNumbers: e.target.checked })
              }
            />
          </label>
          <label>
            Week Starts On:
            <select
              value={options.weekStartsOn}
              onChange={(e) =>
                setOptions({ ...options, weekStartsOn: +e.target.value })
              }>
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
            </select>
          </label>
          <label>
            Select Start of Week and End of Week
            <input
              type="checkbox"
              checked={options.defaultToWeekStartAndEndDates}
              onChange={(e) =>
                setOptions({
                  ...options,
                  defaultToWeekStartAndEndDates: e.target.checked,
                })
              }
            />
          </label>
          <label>
            Highlight Week:
            <input
              type="checkbox"
              checked={options.highlightFullWeekOnHover}
              onChange={(e) =>
                setOptions({
                  ...options,
                  highlightFullWeekOnHover: e.target.checked,
                })
              }
            />
          </label>
        </div>
        <div className="col-span-2">
          <Daterange
            initialDateRange={dateRange}
            onChange={handleDateRangeChange}
            weekStartsOn={
              options.weekStartsOn as DateRangePickerProps["weekStartsOn"]
            }
            showWeekNumbers={options.showWeekNumbers}
            numberOfMonths={
              options.numberOfMonths as DateRangePickerProps["numberOfMonths"]
            }
            highlightFullWeekOnHover={options.highlightFullWeekOnHover}
            defaultToWeekStartAndEndDates={
              options.defaultToWeekStartAndEndDates
            }
          />

          {dateRange.startDate && dateRange.endDate && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p>Selected Range:</p>
              <p>Start: {format(dateRange.startDate, "PPP")}</p>
              <p>End: {format(dateRange.endDate, "PPP")}</p>
              <p>
                Duration:{" "}
                {Math.floor(
                  (dateRange.endDate.getTime() -
                    dateRange.startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1}{" "}
                days
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default App;
