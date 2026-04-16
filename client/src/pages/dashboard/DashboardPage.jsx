import useAuth from "../../hooks/useAuth";
import { USER_ROLES } from "../../constants/appConstants";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function DashboardPage() {
  const { user } = useAuth();

  const roleCopy = {
    [USER_ROLES.ADMIN]: "Manage users, roles, and lifecycle actions.",
    [USER_ROLES.MANAGER]: "Review users and update non-admin accounts.",
    [USER_ROLES.USER]: "View and manage your profile details.",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Overview of your workspace and activity.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-600 dark:text-gray-400">Current role</p>
          <div className="mt-2">
            <Badge variant="info">{user?.role}</Badge>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-slate-600 dark:text-gray-400">Welcome</p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-600 dark:text-gray-400">Status</p>
          <p className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">Active Session</p>
        </Card>
      </div>
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Workspace summary</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">{roleCopy[user?.role]}</p>
      </Card>
    </div>
  );
}
