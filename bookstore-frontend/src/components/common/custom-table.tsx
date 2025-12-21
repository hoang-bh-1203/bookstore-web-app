import React, { type ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { isNilOrEmpty } from '@/utils/dataHelper';
import TableColumnNoData from './table-column-no-data';
import { cn } from '@/lib/utils';

export interface CustomTableColumn<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  width?: number | string;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface CustomTableProps<
  T extends { id: number | string; disabled?: boolean },
> {
  data: T[];
  columns: CustomTableColumn<T>[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  showActions?: boolean;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  className?: string;
  showSelection?: boolean;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  // Pagination props có thể thêm vào sau nếu cần custom pagination component
}

const AdminTable = <T extends { id: number | string; disabled?: boolean }>({
  data,
  columns,
  loading = false,
  rowKey = 'id',
  showActions = true,
  onEdit,
  onDelete,
  className = '',
  showSelection = false,
  selectedRowKeys = [],
  onSelectionChange,
}: CustomTableProps<T>) => {
  const getRowKey = (record: T): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey as keyof T]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      if (checked) {
        const allKeys = data.filter((r) => !r.disabled).map(getRowKey);
        onSelectionChange(
          allKeys,
          data.filter((r) => !r.disabled),
        );
      } else {
        onSelectionChange([], []);
      }
    }
  };

  const handleSelectRow = (record: T, checked: boolean) => {
    if (onSelectionChange) {
      const key = getRowKey(record);
      let newKeys: React.Key[];
      if (checked) {
        newKeys = [...selectedRowKeys, key];
      } else {
        newKeys = selectedRowKeys.filter((k) => k !== key);
      }
      const newSelectedRows = data.filter((item) =>
        newKeys.includes(getRowKey(item)),
      );
      onSelectionChange(newKeys, newSelectedRows);
    }
  };

  return (
    <div className={cn('p-6', className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {showSelection && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      data.length > 0 &&
                      selectedRowKeys.length ===
                        data.filter((r) => !r.disabled).length
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                        ? 'text-right'
                        : 'text-left',
                  )}
                  style={{ width: col.width }}
                >
                  {col.title}
                </TableHead>
              ))}
              {showActions && (
                <TableHead className="w-[80px] text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (showActions ? 1 : 0) +
                    (showSelection ? 1 : 0)
                  }
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (showActions ? 1 : 0) +
                    (showSelection ? 1 : 0)
                  }
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              data.map((record, index) => {
                const key = getRowKey(record);
                const isSelected = selectedRowKeys.includes(key);
                return (
                  <TableRow key={key} data-state={isSelected && 'selected'}>
                    {showSelection && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectRow(record, checked as boolean)
                          }
                          disabled={record.disabled}
                          aria-label={`Select row ${key}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn(
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                              ? 'text-right'
                              : 'text-left',
                        )}
                      >
                        {col.render ? (
                          col.render(record[col.dataIndex], record, index)
                        ) : isNilOrEmpty(record[col.dataIndex]) ? (
                          <TableColumnNoData />
                        ) : (
                          (record[col.dataIndex] as ReactNode)
                        )}
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit?.(record)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete?.(record)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls need to be added here separately if needed, utilizing Shadcn Pagination component */}
    </div>
  );
};

export default AdminTable;
