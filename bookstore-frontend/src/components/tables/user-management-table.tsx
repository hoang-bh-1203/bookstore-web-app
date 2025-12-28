// components/table/UserManagementTable.tsx

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminTable, {
  type CustomTableColumn,
} from '@/components/common/custom-table';
import type {
  PageableParams,
  PagedResponse,
  User,
} from '@/constants/interfaces';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import ModalFormCreateUser from '../modals/modal-form-create-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, User as UserIcon } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import ModalConfirm from '../modals/modal-confirm';
import { isNilOrEmpty } from '@/utils/dataHelper';
import TableColumnNoData from '../common/table-column-no-data';
import { formatDateTime } from '@/utils/dateHelper';
import { debounce } from 'lodash';
import { toast } from 'sonner';
// Import Shadcn Pagination components if you want to implement pagination UI here
// import { Pagination, ... } from "@/components/ui/pagination"

const userColumns: CustomTableColumn<User>[] = [
  {
    key: 'fullName',
    title: 'Full Name',
    dataIndex: 'fullName',
    render: (value, record) =>
      isNilOrEmpty(value) ? (
        <TableColumnNoData />
      ) : (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={record.avatarUrl || undefined} />
            <AvatarFallback>
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span>{value}</span>
        </div>
      ),
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    render: (value) =>
      isNilOrEmpty(value) ? (
        <TableColumnNoData />
      ) : (
        <span className="break-all">{value}</span>
      ),
  },
  {
    key: 'phone',
    title: 'Phone',
    dataIndex: 'phone',
    render: (value) => (isNilOrEmpty(value) ? <TableColumnNoData /> : value),
  },
  {
    key: 'isActive',
    title: 'Active',
    dataIndex: 'isActive',
    align: 'center',
    render: (value) => (
      <Badge
        variant={value ? 'default' : 'secondary'}
        className={value ? 'bg-green-500 hover:bg-green-600' : ''}
      >
        {value ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    key: 'role',
    title: 'Role',
    dataIndex: 'role',
    align: 'center',
    render: (value) =>
      isNilOrEmpty(value) ? (
        <TableColumnNoData />
      ) : (
        <Badge
          variant={value === 'ROLE_ADMIN' ? 'destructive' : 'default'}
          className={
            value === 'ROLE_USER' ? 'bg-blue-500 hover:bg-blue-600' : ''
          }
        >
          {value === 'ROLE_USER' ? 'User' : 'Admin'}
        </Badge>
      ),
  },
  {
    key: 'createdAt',
    title: 'Created At',
    dataIndex: 'createdAt',
    render: (value) =>
      isNilOrEmpty(value) ? (
        <TableColumnNoData />
      ) : (
        formatDateTime(value as string)
      ),
  },
];

const UserManagementTable = () => {
  const defaultUsers = useLoaderData() as PagedResponse<User>;
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const { getAllUsers, createUser, deleteUser, updateUser } = useUser();
  const revalidator = useRevalidator();
  const [pagination, setPagination] = useState({ page: 1, size: 20, total: 0 });
  const [sorter, setSorter] = useState<{ field?: string; order?: string }>({});
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(defaultUsers.data || []);

  const userToDeleteRef = useRef<User | null>(null);

  const fetchUsers = useCallback(
    async (params: PageableParams) => {
      setLoading(true);
      try {
        const response = await getAllUsers({
          ...params,
          page: (params.page || 1) - 1,
        });
        setUsers(response.data);
        setPagination((prev) => ({ ...prev, total: response.totalElements }));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    },
    [getAllUsers],
  );

  const debouncedFetchUsers = useMemo(
    () => debounce(fetchUsers, 500),
    [fetchUsers],
  );

  useEffect(() => {
    const params: PageableParams = {
      page: pagination.page,
      size: pagination.size,
    };
    if (sorter.field && sorter.order)
      params.sort = `${sorter.field},${sorter.order}`;
    if (keyword) params.keyword = keyword;
    debouncedFetchUsers(params);
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [pagination.page, pagination.size, sorter, keyword, debouncedFetchUsers]);

  useEffect(() => {
    setUsers(defaultUsers.data || []);
  }, [defaultUsers.data]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditing(true);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setEditingUser(undefined);
    setIsEditing(false);
    setOpenModal(false);
  };
  const handleDelete = useCallback((user: User) => {
    userToDeleteRef.current = user;
    setOpenModalDelete(true);
  }, []);
  const handleCancelDelete = useCallback((open: boolean) => {
    if (!open) {
      userToDeleteRef.current = null;
      setOpenModalDelete(false);
    }
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const user = userToDeleteRef.current;
    if (!user) return;
    try {
      await deleteUser(user.id);
      toast.success('Xóa người dùng thành công!');
      revalidator.revalidate();
    } catch (error) {
      console.error('Xóa thất bại:', error);
      toast.error('Xóa người dùng thất bại!');
    } finally {
      userToDeleteRef.current = null;
      setOpenModalDelete(false);
    }
  }, [deleteUser, revalidator]);

  const handleSubmitForm = useCallback(
    async (values: User) => {
      try {
        if (isEditing && editingUser) {
          const { password, ...restValues } = values;

          const updatePayload: Partial<User> = {
            ...restValues,
            ...(password ? { password } : {}),
          };
          await updateUser(editingUser.id, updatePayload as User);
          toast.success('Cập nhật thành công!');
        } else {
          await createUser(values);
          toast.success('Tạo thành công!');
        }
        revalidator.revalidate();
      } catch (error) {
        console.error('Error:', error);
        toast.error('Hành động thất bại!');
      } finally {
        setOpenModal(false);
      }
    },
    [createUser, isEditing, updateUser, revalidator, editingUser],
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex px-6 py-4 justify-between items-center border-b">
          <h3 className="text-lg font-semibold text-foreground">
            Quản lý người dùng
          </h3>
          <Button onClick={() => setOpenModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo người dùng mới
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 p-6 border-b">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="pl-8"
            />
          </div>

          <Select
            value={sorter.field}
            onValueChange={(value) =>
              setSorter((prev) => ({ ...prev, field: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trường sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fullName">Tên người dùng</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="createdAt">Ngày tạo</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sorter.order}
            onValueChange={(value) =>
              setSorter((prev) => ({ ...prev, order: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chiều sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Tăng dần</SelectItem>
              <SelectItem value="desc">Giảm dần</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AdminTable<User>
          data={users}
          columns={userColumns}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          className="p-0 border-none shadow-none rounded-none"
        />
        {/* TODO: Add Shadcn Pagination component here based on `pagination` state */}
      </div>

      <ModalFormCreateUser
        isOpen={openModal}
        onClose={handleCloseModal}
        handleSubmit={handleSubmitForm}
        defaultValues={editingUser}
      />

      <ModalConfirm
        title="Xác nhận xóa người dùng"
        description="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        open={openModalDelete}
      />
    </>
  );
};

export default UserManagementTable;
