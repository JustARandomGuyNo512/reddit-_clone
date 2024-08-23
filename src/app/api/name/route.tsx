
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { UsernameValidator } from '@/lib/validators/username'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = UsernameValidator.parse(body)

    
    const username = await db.user.findFirst({
      where: {
        username: name,
      },
    })

    if (username) {
      return new Response(' 该用户名已被占用', { status: 409 })
    }

   
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name,
      },
    })

    return new Response('OK')
  } catch (error) {
    (error)

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      '无法更新，请稍后再试',
      { status: 500 }
    )
  }
}