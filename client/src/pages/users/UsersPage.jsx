import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Pencil } from "lucide-react";
import { userApi } from "../../api/userApi";
import DataTable from "../../components/common/DataTable";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { USER_ROLES, USER_STATUS } from "../../constants/appConstants";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState(null);
  const debouncedSearch = useDebounce(search);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.list({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        role: role || undefined,
        status: status || undefined,
        sortBy: "createdAt",
        sortOrder,
      });
      setUsers(response.data.data.users);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, role, status, sortOrder]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const columns = useMemo(
    () => [
      { key: "name", title: "Name" },
      { key: "email", title: "Email" },
      { key: "role", title: "Role" },
      {
        key: "status",
        title: "Status",
        render: (row) => <Badge variant={row.status === USER_STATUS.ACTIVE ? "success" : "danger"}>{row.status}</Badge>,
      },
      {
        key: "actions",
        title: "Actions",
        render: (row) => (
          <div className="flex gap-2">
            <Link to={`/users/${row._id}`} className="inline-flex items-center gap-1 text-brand-600 hover:underline">
              <Eye size={14} />
              View
            </Link>
            <Link to={`/users/${row._id}/edit`} className="inline-flex items-center gap-1 text-amber-600 hover:underline">
              <Pencil size={14} />
              Edit
            </Link>
            {user?.role === USER_ROLES.ADMIN && (
              <button
                type="button"
                onClick={() => {
                  setSelectedUserId(row._id);
                  setSelectedUserStatus(
                    row.status === USER_STATUS.ACTIVE
                      ? USER_STATUS.INACTIVE
                      : USER_STATUS.ACTIVE
                  );
                }}
                className={
                  row.status === USER_STATUS.ACTIVE
                    ? "text-rose-600 hover:underline"
                    : "text-emerald-600 hover:underline"
                }
              >
                {row.status === USER_STATUS.ACTIVE ? "Deactivate" : "Activate"}
              </button>
            )}
          </div>
        ),
      },
    ],
    [user?.role]
  );

  const onConfirmToggleStatus = async () => {
    try {
      await userApi.toggleStatus(selectedUserId, { status: selectedUserStatus });
      toast.success(
        selectedUserStatus === USER_STATUS.INACTIVE ? "User deactivated" : "User activated"
      );
      setSelectedUserId(null);
      setSelectedUserStatus(null);
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">User management</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Search, filter, and manage workspace users.</p>
      </div>
      <Card className="grid gap-3 md:grid-cols-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name/email"
        />
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value={USER_ROLES.ADMIN}>Admin</option>
          <option value={USER_ROLES.MANAGER}>Manager</option>
          <option value={USER_ROLES.USER}>User</option>
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value={USER_STATUS.ACTIVE}>Active</option>
          <option value={USER_STATUS.INACTIVE}>Inactive</option>
        </Select>
        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </Select>
      </Card>
      <div>
        <DataTable
          columns={columns}
          rows={users.map((item) => ({ ...item, id: item._id }))}
          loading={loading}
          emptyMessage="No users found for this filter."
        />
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      <ConfirmModal
        open={Boolean(selectedUserId)}
        title={
          selectedUserStatus === USER_STATUS.INACTIVE
            ? "Deactivate User"
            : "Activate User"
        }
        description={
          selectedUserStatus === USER_STATUS.INACTIVE
            ? "This will mark the user inactive and block login."
            : "This will restore the user's access so they can log in."
        }
        onCancel={() => {
          setSelectedUserId(null);
          setSelectedUserStatus(null);
        }}
        onConfirm={onConfirmToggleStatus}
      />
    </div>
  );
}
