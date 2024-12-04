import { db } from '@/lib/db'
import "server-only"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')

  if (!q) return new Response('无效参数', { status: 401 })

  const results = await db.subreddit.findMany({
    where: {
      name: {
        startsWith: q,
      },
    },
    include: {
      _count: true,
    },
    take: 5,
  })

  return new Response(JSON.stringify(results))
}