import Icons from "@/components/Icons";
import UserAuthorizeForm from "./UserAuthorizeForm";
import Link from 'next/link'

const SignUp = () => {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='mx-auto h-6 w-6' />
        <h1 className='text-2xl font-semibold tracking-tight'>注册</h1>
        <p className='text-sm max-w-xs mx-auto'>
          您正在设置一个面包网帐户，并同意我们的
          用户协议和隐私政策。
        </p>
      </div>
      <UserAuthorizeForm />
      <p className='px-8 text-center text-sm text-muted-foreground'>
        已有账号?{' '}
        <Link
          href='/sign-in'
          className='hover:text-brand text-sm underline underline-offset-4'>
          登录
        </Link>
      </p>
    </div>
  )
}

export default SignUp