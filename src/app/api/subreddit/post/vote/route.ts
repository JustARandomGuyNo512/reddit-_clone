import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostVoteValidator } from "@/lib/validators/votes";
import { VoteType } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const body = req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    const vote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId: postId,
      },
    });

    if (vote) {
      if (vote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new Response("Vote removed", { status: 200 });
      } else {
        await db.vote.update({
            where: {
              userId_postId:{
                postId,
                userId: session.user.id,
              }
            },
            data: {
              type: voteType,
            }
        });
        const voteAmt = post.votes.reduce((acc, vote) => {
            return vote.type === VoteType.UP ? acc + 1 : acc - 1;
        }, 0);
        if (voteAmt >= 10) {

        }
        return new Response("Vote updated", { status: 200 });
      }
    } else {

    }
  } catch (err) {}
}
