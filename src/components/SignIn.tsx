import Icons from "@/components/Icons";
import Link from "next/link";
import UserAuthorizeForm from "./UserAuthorizeForm";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">欢迎回来</h1>
        <p className="text-sm max-w-xs mx-auto">
          您正在建立一个Reddit帐户，这代表您同意我们的
          用户协议和隐私政策。
        </p>
      </div>
      {/* 登录逻辑 */}
      <UserAuthorizeForm></UserAuthorizeForm>
      <p className="px-8 text-center text-sm text-muted-foreground">
        没有账号? {" "}
        <Link
          href="/sign-up"
          className="hover:text-brand text-sm underline underline-offset-4"
        >
          注册
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
