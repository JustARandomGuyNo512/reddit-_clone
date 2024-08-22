import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
import { auth } from "@/lib/auth";
import GeneralFeed from "./GeneralFeed";

const CustomFeed = async () => {

    const session = await auth();

    if (!session?.user) {
        return (
            <>
                {/* @ts-expect-error */}
                <GeneralFeed/>
            </>
        )
    }

    const followedCommunities = await db.subscription.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          subreddit: true,
        },
      })

      const posts = await db.post.findMany({
        where: {
          subreddit: {
            name: {
              in: followedCommunities.map((sub) => sub.subreddit.name),
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          votes: true,
          author: true,
          comments: true,
          subreddit: true,
        },
        take: 5,
      })
    return (
        <>
            <PostFeed initialPosts={posts}></PostFeed>
        </>
    );
}

export default CustomFeed;