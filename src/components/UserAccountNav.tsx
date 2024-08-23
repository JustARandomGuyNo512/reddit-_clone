"use client";
import { FC } from "react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import UserAvator from "./UserAvatar";
import { DropdownMenuContent } from "./ui/DropdownMenu";
import Link from "next/link";

interface UserNavAccountProps extends React.HTMLAttributes<HTMLDivElement>  {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: FC<UserNavAccountProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvator
          user={{ name: user.name, image: user.image }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/"}>主页</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/r/create"}>创建社区</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/settings"}>设置</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            signOut({
              callbackUrl: window.location.origin + "/sign-in",
            });
          }}
        >
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
