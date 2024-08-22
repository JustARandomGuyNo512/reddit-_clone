import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { VoteType } from "@prisma/client";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentsSectionProps {
  postId: string;
}

const commentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await auth();
  const comments = await db.comment.findMany({
    where: {
      postId: postId,
      replyTo: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />
      <CreateComment postId={postId} />
      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((comment) => {
            const voteAmt = comment.votes.reduce(
              (acc, vote) => acc + (vote.type === VoteType.UP ? 1 : -1),
              0
            );
            const commentVote = comment.votes.find(
              (vote) => vote.userId === session?.user?.id
            );
            return (
              <div key={comment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={comment}
                    currentVote={commentVote}
                    votesAmt={voteAmt}
                    postId={postId}
                  />
                </div>

                {comment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      if (vote.type === "DOWN") return acc - 1;
                      return acc;
                    }, 0);

                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id
                    );
                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default commentsSection;
