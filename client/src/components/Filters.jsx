import React from "react";
import { useState, useEffect } from "react";
import { Input, Button, Select } from "./UI";
import { Search, X, Filter } from "lucide-react";

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
  const [search, setSearch] = useState(defaults.search || "");
  const [sort, setSort] = useState(defaults.sort || "asc");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced values for auto search
  const debouncedCity = useDebouncedValue(city);
  const debouncedState = useDebouncedValue(state);
  const debouncedPinCode = useDebouncedValue(pinCode);
  const debouncedSearch = useDebouncedValue(search);
  const debouncedSort = useDebouncedValue(sort);

  useEffect(() => {
    onChange({
      city: debouncedCity,
      state: debouncedState,
      pinCode: debouncedPinCode,
      search: debouncedSearch,
      sort: debouncedSort,
    });
    // eslint-disable-next-line
  }, [
    debouncedCity,
    debouncedState,
    debouncedPinCode,
    debouncedSearch,
    debouncedSort,
  ]);

  useEffect(() => {
    setCity(defaults.city || "");
    setState(defaults.state || "");
    setPinCode(defaults.pinCode || "");
    setSearch(defaults.search || "");
    setSort(defaults.sort || "asc");
  }, [defaults]);

  const hasActiveFilters = city || state || pinCode || search;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center gap-2">
            <Filter size={16} />
            Filters & Search
          </h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="secondary"
                onClick={onClear}
                className="flex items-center gap-1 text-xs px-2 py-1"
              >
                <X size={14} />
                <span className="hidden xs:inline">Clear All</span>
                <span className="xs:hidden">Clear</span>
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs px-2 py-1"
            >
              {showAdvanced ? "Hide" : "Show"} Advanced
            </Button>
          </div>
        </div>

        {/* Main Search */}
        <div className="mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search by name or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                placeholder="Filter by city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <Input
                placeholder="Filter by state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PIN Code
              </label>
              <Input
                placeholder="Filter by PIN"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full"
              >
                <option value="asc">First Name ↑</option>
                <option value="desc">First Name ↓</option>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: "{search}"
                <button
                  onClick={() => setSearch("")}
                  className="ml-1 hover:text-blue-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                City: {city}
                <button
                  onClick={() => setCity("")}
                  className="ml-1 hover:text-green-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {state && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                State: {state}
                <button
                  onClick={() => setState("")}
                  className="ml-1 hover:text-green-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {pinCode && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                PIN: {pinCode}
                <button
                  onClick={() => setPinCode("")}
                  className="ml-1 hover:text-green-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
