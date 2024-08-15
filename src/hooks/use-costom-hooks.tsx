import Link from "next/link";
import {toast} from "./use-toast"

export const useCustomToast = () => {
    const loginToast = () => {
        const {dismiss} = toast({
            title: "未登录",
            description: "你需要重新登陆",
            variant: "destructive",
            action: (
                <Link href='/sign-in' onClick={() => dismiss()}>Login</Link>
            )
        });
    }

    return {
        loginToast
    }
}