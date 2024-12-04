import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { SubredditValidator } from "@/lib/validators/subreddit"
import { z } from "zod"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return new Response("未认证", { status: 401 })
        }

        const body = await req.json()
        const { name } = SubredditValidator.parse(body)
        // 检查是否为社区创建者
        const subreddit = await db.subreddit.findFirst({
            where: {
                name: name,
                creatorId: session.user.id
            }
        })

        if (!subreddit) {
            return new Response("没有权限删除该社区", { status: 403 })
        }
        await db.subreddit.delete({
            where: {
                name: name
            }
        })

        return new Response("社区删除成功")
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return new Response("无效参数", { status: 422 })
        }
        return new Response("删除失败", { status: 500 })
    }
} 