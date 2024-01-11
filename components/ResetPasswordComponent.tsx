import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FormEvent, useState } from "react";
import { useToast } from "./ui/use-toast";

interface ResetPasswordComponentProps {
  token: string | null;
}

const ResetPasswordComponent: React.FC<ResetPasswordComponentProps> = ({
  token,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleResetPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (token && newPassword) {
      try {
        await supabase.auth.getSession();
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (updateError) {
          console.error("Error resetting password:", updateError);
          toast({
            title: "Error",
            description: "Error resetting the password. Please try again.",
          });
        } else {
          toast({
            title: "Success",
            description: "Password reset successfully.",
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className=" text-center text-2xl font-bold  tracking-tight text-gray-900">
          Recovery Password
        </h2>
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white p-4 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-2" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                New Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  minLength={7}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900..."
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
