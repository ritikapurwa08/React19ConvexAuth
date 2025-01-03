import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import {
  LoaderIcon,
  LockIcon,
  MailIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Form } from "@/components/ui/form";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthSignInSchemaType } from "../constants/auth-types";
import { AuthZodForm } from "../constants/auh-zod-form";
import CustomInput from "@/components/forms/custom-input";
import CustomPasswordInput from "@/components/forms/custom-password-input";
import SubmitLoader from "@/components/custom/app-components/loaders/submit-loader";
const SignInInput = () => {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [loading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const { signInZodForm } = AuthZodForm();

  const location = useLocation();

  const handleSignIn = (values: AuthSignInSchemaType) => {
    setIsloading(true);
    setError("");
    signIn("password", {
      email: values.email,
      password: values.password,
      flow: "signIn",
    })
      .then(() => {
        navigate("/");
        console.log(location.pathname);
        toast.success("Sign in Successful");
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  return (
    <Form {...signInZodForm}>
      <form
        className="flex flex-col gap-y-2"
        onSubmit={signInZodForm.handleSubmit(handleSignIn)}
      >
        <CustomInput
          control={signInZodForm.control}
          name="email"
          label="Email"
          disabled={loading}
          placeholder="Enter Your Email"
          icon={MailIcon}
        />
        <CustomPasswordInput
          control={signInZodForm.control}
          label="Password"
          name="password"
          disabled={loading}
          placeholder="Enter Your Password"
          icon={LockIcon}
        />
        {!!error && (
          <div className="flex  h-8 rounded-lg flex-row bg-red-500/50 items-center justify-center px-4">
            <TriangleAlertIcon className="  size-3.5" />
            <p className="p-3 rounded-lg ">{error}</p>
          </div>
        )}
        <div className="w-full my-4">
          <SubmitLoader
            defaultText="Sign In"
            loadingIcon={LoaderIcon}
            loadingState={loading}
            loadingText="Signing in..."
          />
        </div>
      </form>
    </Form>
  );
};

export default SignInInput;
