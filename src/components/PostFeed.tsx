"use client";
import { FC, useEffect, useRef, useState } from "react";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { da } from "date-fns/locale";
import Post from "./Post";
import { useRouter } from "next/navigation";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string; // TODO: define post type
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  const lastUseRef = useRef<HTMLElement>(null);
  const { data: session } = useSession();
  const { ref, entry } = useIntersection({
    root: lastUseRef.current,
    threshold: 1,
  });

  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, []);

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const params = window.location.toString().split("/");
      const query =
        params[0] +
        "//" +
        params[2] +
        "/" +
        "api/posts?limit=5&page=" +
        pageParam +
        (!!subredditName ? "&subredditName=" + subredditName : "");
      //console.log(query);
      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [1],
      },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;
  return ( isClient ?
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find((vote) => {
          return vote.userId === session?.user.id;
        });

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post subredditName={post.subreddit.name} post = {post} commentAmt={post.comments.length} _votesAmt={votesAmt} currentVote={currentVote} key={post.id}/>
            </li>
          );
        } else {
            return <Post subredditName={post.subreddit.name} post={post}  commentAmt={post.comments.length} _votesAmt={votesAmt} currentVote={currentVote}  key={post.id}/>;
        }
      })}
    </ul> : <></>
  );
};

export default PostFeed;
