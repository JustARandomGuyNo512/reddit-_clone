import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/votes";
import { CachedPost } from "@/types/redis";
import { VoteType } from "@prisma/client";
import { z } from "zod";
const CACHE_NUM = 1;

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
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
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        });
        const voteAmt = post.votes.reduce((acc, vote) => {
          return vote.type === VoteType.UP ? acc + 1 : acc - 1;
        }, 0);
        if (voteAmt >= CACHE_NUM) {
          
          try {
            const cachePayload: CachedPost = {
              authorUsername: post.author.username ?? "",
              content: JSON.stringify(post.content),
              id: post.id,
              title: post.title,
              currentVote: voteType,
              createdAt: post.createdAt,
            };
            console.log("cacheing", cachePayload);
            await redis.hset("post:" + postId, cachePayload);
          } catch(e) {console.log("redis error:",e)}
        }
        return new Response("Vote updated", { status: 200 });
      }
    } else {
      await db.vote.create({
        data: {
          type: voteType,
          userId: session.user.id,
          postId: postId,
        },
      });
      const voteAmt = post.votes.reduce((acc, vote) => {
        return vote.type === VoteType.UP ? acc + 1 : acc - 1;
      }, 0);
      if (voteAmt >= CACHE_NUM) {
        
        try {
          const cachePayload: CachedPost = {
            authorUsername: post.author.username ?? "",
            content: JSON.stringify(post.content),
            id: post.id,
            title: post.title,
            currentVote: voteType,
            createdAt: post.createdAt,
          };
          await redis.hset("post:" + postId, cachePayload);
        } catch(e) {console.log("redis error:",e)}
      }
    }
    return new Response("Vote created", { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return new Response("无效参数", {
        status: 422,
      });
    }
    return new Response("failed", {
      status: 500,
    });
  }
}
