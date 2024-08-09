import { FC } from "react";
import { User } from "next-auth";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import UserAvator from "./UserAvatar";

interface UserNavAccountProps {
    user: Pick<User, "name" | "image"| "email">
}

const UserAccountNav:FC<UserNavAccountProps> = ({user}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvator user={{name: user.name, image:user.image}} className="h-8 w-8"/>
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
}

export default UserAccountNav