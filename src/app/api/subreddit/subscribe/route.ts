import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  // TODO: implement
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
            return new Response("你已经加入了", { status: 400 });
        } else {
            await db.subscription.create({
                data: {
                    subredditId: subredditId,
                    userId: session.user.id
                }
            })
            return new Response(subredditId);
        }
    } catch (error) {
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