import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success("Account created. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-gray-950">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Set up access to your team dashboard.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="space-y-4">
            <div>
              <Input {...register("name")} placeholder="Name" />
              {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
            </div>
            <div>
              <Input {...register("email")} placeholder="Email" />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
            </div>
            <div>
              <Input {...register("password")} type="password" placeholder="Password" />
              {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="mt-5 w-full">
            {isSubmitting ? "Creating account..." : "Create account"}
            <UserPlus size={16} />
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-600 dark:text-gray-400">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
