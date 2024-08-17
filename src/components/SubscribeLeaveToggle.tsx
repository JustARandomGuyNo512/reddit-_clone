"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-costom-hooks";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean;
  subredditId: string;
  subredditName: string;
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  subredditId,
  subredditName,
}: SubscribeLeaveToggleProps) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const {mutate: subscribe, isLoading: isSubLoading} = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      };
      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "操作失败",
        description: "请稍后再试",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      })
      return toast({
        title: "操作成功",
        description: "加入社区" + subredditName,
        variant: "default",
      })
    }
  });

  const {mutate: unsubscribe, isLoading: isUnSubLoading} = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      };
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "操作失败",
        description: "请稍后再试",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      })
      return toast({
        title: "操作成功",
        description: "离开社区" + subredditName,
        variant: "default",
      })
    }
  });

  return isSubscribed ? (
    <Button onClick={() => unsubscribe()} isLoading={isUnSubLoading} className="w-full mt-1 mb-4">离开社区</Button>
  ) : (
    <Button onClick={() => subscribe()} isLoading={isSubLoading} className="w-full mt-1 mb-4">加入社区</Button>
  );
};

export default SubscribeLeaveToggle;
