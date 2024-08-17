import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
    try {

        const session = await auth();
        if (!session?.user) {
            return new Response("未认证", { status: 401 });
        }
        const body = await req.json();
        const {subredditId} = SubredditSubscriptionValidator.parse(body);
        const hasSubscribed = await db.subscription.findFirst({
            where: {
                subredditId: subredditId,
                userId: session.user.id
            }
        })
        if (hasSubscribed) {
            await db.subscription.delete({
                where: {
                    userId_subredditId: {
                        subredditId: subredditId,
                        userId: session.user.id
                    }
                }
            })
            return new Response("已取消订阅", { status: 200 });
        } else {
            return new Response("你并未加入", { status: 400 });
        }
    } catch(error) {
        if (error instanceof z.ZodError) {
            return new Response("无效参数", {
                status: 422,
            })
        }
        return new Response("failed", {
            status: 500,
        })
    }
}