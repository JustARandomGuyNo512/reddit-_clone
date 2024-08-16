"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-costom-hooks";

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
  const {} = useMutation({
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
  });

  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4">离开社区</Button>
  ) : (
    <Button className="w-full mt-1 mb-4">加入社区</Button>
  );
};

export default SubscribeLeaveToggle;
