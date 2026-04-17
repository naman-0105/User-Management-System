import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { userApi } from "../../api/userApi";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { USER_STATUS } from "../../constants/appConstants";

const auditLabel = (value) => (value ? new Date(value).toLocaleString() : "-");

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await userApi.getById(id);
        setUser(response.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <Card>Loading user...</Card>;
  }

  if (!user) {
    return <Card>User not found.</Card>;
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">User Detail</h1>
        <Link to={`/users/${id}/edit`}>
          <Button variant="secondary">Edit</Button>
        </Link>
      </div>
      <dl className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <dt className="text-xs uppercase text-slate-500 dark:text-gray-400">Name</dt>
          <dd className="text-slate-900 dark:text-gray-100">{user.name}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500 dark:text-gray-400">Email</dt>
          <dd className="text-slate-900 dark:text-gray-100">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500 dark:text-gray-400">Role</dt>
          <dd className="text-slate-900 dark:text-gray-100">{user.role}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500 dark:text-gray-400">Status</dt>
          <dd>
            <Badge variant={user.status === USER_STATUS.ACTIVE ? "success" : "danger"}>{user.status}</Badge>
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500 dark:text-gray-400">Created At</dt>
          <dd className="text-slate-900 dark:text-gray-100">{auditLabel(user.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500 dark:text-gray-400">Updated At</dt>
          <dd className="text-slate-900 dark:text-gray-100">{auditLabel(user.updatedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500 dark:text-gray-400">Created By</dt>
          <dd className="text-slate-900 dark:text-gray-100">{user.createdBy?.name || "-"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500 dark:text-gray-400">Updated By</dt>
          <dd className="text-slate-900 dark:text-gray-100">{user.updatedBy?.name || "-"}</dd>
        </div>
      </dl>
    </Card>
  );
}
