"use client";

import { Button } from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const Page = () => {
    const searchParams = useSearchParams();
    const name = searchParams.get('name');

    const router = useRouter();

    const { mutate: deleteCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post("/api/subreddit/delete", { name: name });
            return data;
        },
        onSuccess: () => {
            router.push("/");
        },
        onError: (error) => {
            console.log(error);
        }
    }); 
    return (
        <div style={{display: 'flex', flexDirection: 'column', lineHeight: '2', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
            <h1 style={{color: "red", fontSize: '24px'}}>确定要删除社区`{name}`吗？</h1>
            <div>
            <Button variant="outline_danger"
            isLoading={isLoading}
            onClick={() => deleteCommunity()}
            >
              删除
            </Button>
            </div>
        </div>
    )
}

export default Page;
