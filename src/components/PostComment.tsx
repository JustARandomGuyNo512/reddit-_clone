"use client";
import { FC, useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { CommentVote, User, Comment } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./CommentVotes";
import { Button } from "./ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesAmt,
  currentVote,
  postId,
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const { mutate: reply, isLoading } = useMutation({
    mutationFn: async ({ postId, replyToId, text }: CommentRequest) => {
      const payload = {
        postId,
        text,
        replyToId,
      };
      const { data } = await axios.patch(
        "/api/subreddit/post/comment",
        payload
      );
      return data;
    },
    onError: (error) => {
      return toast({
        title: "Error",
        description: "错误，请稍后再试",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      setInput("");
      setIsReplying(false);
      router.refresh();
    },
  });
  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          className="h-6 w-6"
          user={{ name: comment.author.name, image: comment.author.image }}
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>

          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes
          commentId={comment.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote?.type}
        ></CommentVotes>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
          }}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          回复
        </Button>
        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">你的评论</Label>
            <div className="mt-2">
              <Textarea
                onFocus={(e) =>
                  e.currentTarget.setSelectionRange(
                    e.currentTarget.value.length,
                    e.currentTarget.value.length
                  )
                }
                autoFocus
                id="comment"
                rows={1}
                onChange={(e) => setInput(e.target.value)}
                placeholder="说点什么"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  isLoading={isLoading}
                  disabled={input.length === 0}
                  onClick={() => {
                    if (input.length === 0) return;
                    reply({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                >
                  发送
                </Button>
                <Button
                  tabIndex={-1}
                  variant="subtle"
                  onClick={() => setIsReplying(false)}
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComment;