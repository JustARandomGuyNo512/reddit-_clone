import { z } from 'zod'

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: '标题最少3个字',
    })
    .max(128, {
      message: '标题最多128个字',
    }),
  subredditId: z.string(),
  content: z.any(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>