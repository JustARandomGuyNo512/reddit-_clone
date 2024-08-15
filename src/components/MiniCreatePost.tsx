"use client"

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";

interface MiniCreatePostProps {
    session: Session
}

const MiniCreatePost: React.FC<MiniCreatePostProps> = ({ session }) => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <>
            <li className='overflow-hidden rounded-md bg-white shadow'>

            </li>
        </>
    )
}

export default MiniCreatePost;