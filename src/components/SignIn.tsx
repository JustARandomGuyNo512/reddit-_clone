import Icons from "@/components/Icons";
import Link from "next/link";
import UserAuthorizeForm from "./UserAuthorizeForm";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Reddit account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </div>
      {/* 登录逻辑 */}
      <UserAuthorizeForm></UserAuthorizeForm>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don't have a Reddit account? {" "}
        <Link
          href="/sign-up"
          className="hover:text-brand text-sm underline underline-offset-4"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
