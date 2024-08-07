"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FC } from "react";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import Icons from "@/components/Icons";
import { useToast } from "@/hooks/use-toast";

interface UserAuthorizeFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthorizeForm: FC<UserAuthorizeFormProps> = ({
  className,
  ...props
}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();

    const Login = async (platform: string) => {
        setIsLoading(true);
        try {
            await signIn(platform);
        } catch(e) {
            console.log(e);
            toast({
                title: "Error",
                description: "Something went wrong with " + platform,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button type="button" size="sm" className="w-full" isLoading={isLoading} disabled={isLoading} onClick={() => Login("github")}>
        {/* {isLoading ? <></> : <Icons.github width="24" height="24" ></Icons.github>} */}
        Github
      </Button>
    </div>
  );
};

export default UserAuthorizeForm;
