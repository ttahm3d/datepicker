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
  });

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
    console.log("Date range changed:", newDateRange);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Date Range Picker</h1>
      <div className="bg-gray-200 p-4 flex gap-4">
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
      </div>
      {/* <DateRangePicker
        initialDateRange={dateRange}
        onChange={handleDateRangeChange}
        weekStartsOn={
          options.weekStartsOn as DateRangePickerProps["weekStartsOn"]
        }
        showWeekNumbers={options.showWeekNumbers}
        numberOfMonths={
          options.numberOfMonths as DateRangePickerProps["numberOfMonths"]
        } // Change to 3 if you want to show 3 months
      /> */}
      <Daterange
        initialDateRange={dateRange}
        onChange={handleDateRangeChange}
        weekStartsOn={
          options.weekStartsOn as DateRangePickerProps["weekStartsOn"]
        }
        showWeekNumbers={options.showWeekNumbers}
        numberOfMonths={
          options.numberOfMonths as DateRangePickerProps["numberOfMonths"]
        } // Change to 3 if you want to show 3 months
      />

      {dateRange.startDate && dateRange.endDate && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p>Selected Range:</p>
          <p>Start: {format(dateRange.startDate, "PPP")}</p>
          <p>End: {format(dateRange.endDate, "PPP")}</p>
          <p>
            Duration:{" "}
            {Math.floor(
              (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1}{" "}
            days
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
