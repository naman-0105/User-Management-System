import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { userApi } from "../../api/userApi";
import useAuth from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    values: { name: user?.name || "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      const payload = { name: values.name };
      if (values.password) {
        payload.password = values.password;
      }
      await userApi.updateProfile(payload);
      await refreshProfile();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My Profile</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Role: {user?.role}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-gray-300">Name</label>
          <Input {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-gray-300">New Password</label>
          <Input {...register("password")} type="password" />
          {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
