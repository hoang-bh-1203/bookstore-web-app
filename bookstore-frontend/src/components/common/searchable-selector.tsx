// components/common/searchable-selector.tsx

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
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
  defaultValue?: T; // Chúng ta mong đợi một Object đầy đủ ở đây
}

function SearchableSelector<T extends Record<string, any>>({
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

  // State lưu trữ item đang được chọn (Object đầy đủ)
  const [selectedItem, setSelectedItem] = useState<T | undefined>(defaultValue);

  // Cập nhật selectedItem khi defaultValue thay đổi từ bên ngoài (ví dụ: khi mở modal edit)
  useEffect(() => {
    setSelectedItem(defaultValue);
  }, [defaultValue]);

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
    // Chỉ fetch khi mở popup hoặc search thay đổi
    if (open) {
      debouncedFetch(searchValue);
    }
    // Cleanup debounce khi unmount
    return () => {
      debouncedFetch.cancel();
    };
  }, [searchValue, debouncedFetch, open]);

  const handleSelect = (item: T) => {
    setSelectedItem(item);
    setOpen(false);
    if (onSelect) {
      onSelect(item);
    }
  };

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
          {/* Hiển thị label từ selectedItem (dù nó có trong list data hay không) */}
          {selectedItem ? (
            String(selectedItem[labelKey])
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

      {/* Thêm z-index cao và Portal nếu bị lỗi hiển thị đè, nhưng thường shadcn xử lý rồi */}
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
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

            {!loading && data.length === 0 && (
              <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            )}

            <CommandGroup>
              {data.map((item) => {
                // Ép kiểu về String để so sánh an toàn
                const isSelected = selectedItem
                  ? String(selectedItem[valueKey]) === String(item[valueKey])
                  : false;

                return (
                  <CommandItem
                    key={String(item[valueKey])}
                    value={String(item[labelKey])} // Dùng tên để search/filter local (nếu bật filter)
                    onSelect={() => handleSelect(item)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{item[labelKey]}</span>
                      {renderExtraInfo && renderExtraInfo(item)}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SearchableSelector;
