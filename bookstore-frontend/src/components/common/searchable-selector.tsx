import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';
import { debounce } from 'lodash';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { PageableParams } from '@/constants/interfaces';

interface SearchableSelectorProps<T> {
  placeholder?: string;
  valueKey: keyof T;
  labelKey: keyof T;
  className?: string;
  onSelect?: (option: T | null) => void;
  disabled?: boolean;
  pageSize?: number;
  fetchData: (params: PageableParams) => Promise<T[]>;
  renderExtraInfo?: (item: T) => React.ReactNode;
  defaultValue?: any;
}

function SearchableSelector<T>({
  placeholder = 'Tìm kiếm và chọn...',
  valueKey,
  labelKey,
  className = '',
  onSelect,
  disabled = false,
  pageSize = 20,
  fetchData,
  renderExtraInfo,
  defaultValue,
}: SearchableSelectorProps<T>) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedValue, setSelectedValue] = useState<any>(defaultValue);

  const handleFetchData = async (searchTerm = '') => {
    setLoading(true);
    try {
      const result = await fetchData({
        keyword: searchTerm,
        size: pageSize,
      } as PageableParams);
      setData(result);
    } catch (error) {
      console.error('Lỗi khi fetch data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(handleFetchData, 500), [
    fetchData,
    pageSize,
  ]);

  useEffect(() => {
    debouncedFetch(searchValue);
  }, [searchValue, debouncedFetch]);

  // Initialize with default value if provided, might need a way to fetch initial single item if not in list
  useEffect(() => {
    if (defaultValue && data.length === 0) {
      // Optional: logic to fetch specific item by ID if needed for initial display
    }
  }, [defaultValue, data]);

  const filteredOptions = useMemo(() => {
    return data.map((item) => ({
      value: item[valueKey] as string, // Command value should ideally be string
      label: item[labelKey] as string,
      data: item,
    }));
  }, [data, valueKey, labelKey]);

  const selectedOption = filteredOptions.find(
    (opt) => opt.value === selectedValue,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          {' '}
          {/* We do server-side filtering */}
          <CommandInput
            placeholder={placeholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {loading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <Loader2 className="mx-auto h-4 w-4 animate-spin" /> Đang tải...
              </div>
            )}
            {!loading && filteredOptions.length === 0 && (
              <CommandEmpty>Không tìm thấy.</CommandEmpty>
            )}
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const newVal =
                      currentValue === selectedValue ? '' : currentValue;
                    setSelectedValue(newVal);
                    const selectedItem = filteredOptions.find(
                      (opt) => opt.value === newVal,
                    );
                    if (onSelect) {
                      onSelect(selectedItem ? selectedItem.data : null);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValue === option.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {renderExtraInfo && renderExtraInfo(option.data)}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SearchableSelector;
