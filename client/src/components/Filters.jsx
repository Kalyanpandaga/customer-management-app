import { useState, useEffect } from "react";
import { Input, Button, Select } from "./UI";

function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function Filters({ defaults, onChange, onClear }) {
  const [city, setCity] = useState(defaults.city || "");
  const [state, setState] = useState(defaults.state || "");
  const [pinCode, setPinCode] = useState(defaults.pinCode || "");
  const [sort, setSort] = useState(defaults.sort || "asc");

  // Debounced values for auto search
  const debouncedCity = useDebouncedValue(city);
  const debouncedState = useDebouncedValue(state);
  const debouncedPinCode = useDebouncedValue(pinCode);
  const debouncedSort = useDebouncedValue(sort);

  useEffect(() => {
    onChange({
      city: debouncedCity,
      state: debouncedState,
      pinCode: debouncedPinCode,
      sort: debouncedSort,
    });
    // eslint-disable-next-line
  }, [debouncedCity, debouncedState, debouncedPinCode, debouncedSort]);

  useEffect(() => {
    setCity(defaults.city || "");
    setState(defaults.state || "");
    setPinCode(defaults.pinCode || "");
    setSort(defaults.sort || "asc");
  }, [defaults]);

  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <Input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full"
        />
        <Input
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full"
        />
        <Input
          placeholder="PIN"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          className="w-full"
        />
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full"
        >
          <option value="asc">First Name ↑</option>
          <option value="desc">First Name ↓</option>
        </Select>
        <div className="hidden md:block" />
        <Button
          variant="secondary"
          onClick={onClear}
          className="w-full md:w-auto"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
