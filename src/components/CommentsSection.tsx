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
            const commentVoteAmt = comment.votes.find(
              (vote) => vote.userId === session?.user?.id
            );
            return (
              <div key={comment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={comment}
                    // currentVote={topLevelCommentVote}
                    // votesAmt={topLevelCommentVotesAmt}
                    // postId={postId}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default commentsSection;
