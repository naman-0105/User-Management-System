import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { userApi } from "../../api/userApi";
import useAuth from "../../hooks/useAuth";
import { USER_ROLES, USER_STATUS } from "../../constants/appConstants";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function EditUserPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        role:
          user?.role === USER_ROLES.ADMIN
            ? z.enum([USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER])
            : z.string().optional(),
        status:
          user?.role === USER_ROLES.ADMIN
            ? z.enum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE])
            : z.string().optional(),
      }),
    [user?.role]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    const load = async () => {
      const response = await userApi.getById(id);
      const target = response.data.data;
      setValue("name", target.name);
      setValue("email", target.email);
      setValue("role", target.role);
      setValue("status", target.status);
    };
    load();
  }, [id, setValue]);

  const onSubmit = async (values) => {
    try {
      const payload = { name: values.name, email: values.email, status: values.status };
      if (user?.role === USER_ROLES.ADMIN) {
        payload.role = values.role;
      }
      await userApi.update(id, payload);
      toast.success("User updated");
      navigate(`/users/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Edit User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-gray-300">Name</label>
          <Input {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-gray-300">Email</label>
          <Input {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
        </div>
        {user?.role === USER_ROLES.ADMIN && (
          <div>
            <label className="mb-1 block text-sm text-slate-700 dark:text-gray-300">Role</label>
            <Select {...register("role")}>
              <option value={USER_ROLES.USER}>User</option>
              <option value={USER_ROLES.MANAGER}>Manager</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
            </Select>
          </div>
        )}
        {user?.role === USER_ROLES.ADMIN && (
          <div>
            <label className="mb-1 block text-sm text-slate-700 dark:text-gray-300">Status</label>
            <Select {...register("status")}>
              <option value={USER_STATUS.ACTIVE}>Active</option>
              <option value={USER_STATUS.INACTIVE}>Inactive</option>
            </Select>
          </div>
        )}
        <Button type="submit" disabled={isSubmitting} className="md:col-span-2">
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
