import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Moon, Sun, User, Users, UserPlus, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import Button from "../ui/Button";
import { USER_ROLES } from "../../constants/appConstants";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER] },
  { to: "/users", label: "Users", icon: Users, roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER] },
  { to: "/create-user", label: "Create User", icon: UserPlus, roles: [USER_ROLES.ADMIN] },
  { to: "/profile", label: "Profile", icon: User, roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER] },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gray-950 dark:text-gray-100">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-5 shadow-sm transition-transform dark:border-gray-800 dark:bg-gray-900 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-semibold text-slate-900 dark:text-white">
            UMS Portal
          </Link>
          <button type="button" className="md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-gray-300">{user?.name}</p>
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">{user?.role}</p>
        <nav className="mt-6 flex flex-col gap-2">
          {navItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-brand-600 text-white"
                      : "text-slate-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
        </nav>
      </aside>

      <main className="md:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 md:px-6">
          <button type="button" className="md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="secondary" className="px-3" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </header>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
