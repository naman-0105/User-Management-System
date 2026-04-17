import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { userApi } from "../../api/userApi";
import { USER_ROLES, USER_STATUS } from "../../constants/appConstants";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER]),
  status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE]),
});

export default function CreateUserPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: USER_ROLES.USER, status: USER_STATUS.ACTIVE },
  });

  const onSubmit = async (values) => {
    try {
      const response = await userApi.create(values);
      const generatedPassword = response.data.data.generatedPassword;
      toast.success(generatedPassword ? `User created. Temp password: ${generatedPassword}` : "User created");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Create User</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Add a new user with role and status.</p>
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
        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-gray-300">Role</label>
          <Select {...register("role")}>
            <option value={USER_ROLES.USER}>User</option>
            <option value={USER_ROLES.MANAGER}>Manager</option>
            <option value={USER_ROLES.ADMIN}>Admin</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-gray-300">Status</label>
          <Select {...register("status")}>
            <option value={USER_STATUS.ACTIVE}>Active</option>
            <option value={USER_STATUS.INACTIVE}>Inactive</option>
          </Select>
        </div>
        <Button type="submit" disabled={isSubmitting} className="md:col-span-2">
          {isSubmitting ? "Creating..." : "Create user"}
        </Button>
      </form>
    </Card>
  );
}
