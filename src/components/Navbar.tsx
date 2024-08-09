
import Link from "next/link";
import Icons from "./Icons";
import { buttonVariants } from './ui/Button'
import { auth } from "@/lib/auth";
import UserAccountNav from "@/components/UserAccountNav";

// get user session
const Navbar = async () => {
    const session = await auth();
    console.log("user:", session?.user);
    return (
        <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
            <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
                {/* logo */}
                <Link href='/' className='flex gap-2 items-center'>
                    <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' />
                    <p className='hidden text-zinc-700 text-sm font-medium md:block'>Reddit</p>
                </Link>

                {/* search bar */}
                
                {/* 登录验证以及登录跳转 */}
                {
                     session?.user ? 
                        (<UserAccountNav user={session.user}></UserAccountNav>) 
                      : (<Link href='/sign-in' className={buttonVariants()}>Sign In</Link>)
                }
            </div>
        </div>
    );
}

export default Navbar;
