import { db } from "@/lib/db"
import axios from "axios"
import PostFeed from "./PostFeed";

const GeneralFeed = async () => {
    const posts = await db.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            votes:true,
            author: true,
            comments: true,
            subreddit: true,
        },
        take: 5,
    });
    return (
        <>
            <PostFeed initialPosts={posts}></PostFeed>
        </>
    );
}

export default GeneralFeed