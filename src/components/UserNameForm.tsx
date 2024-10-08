'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button, buttonVariants } from '@/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { UsernameValidator } from '@/lib/validators/username'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, 'id' | 'name'>
}

type FormData = z.infer<typeof UsernameValidator>

export function UserNameForm({ user, className, ...props }: UserNameFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.name || '',
    },
  })

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: FormData) => {
      const payload: FormData = { name }

      const { data } = await axios.patch(`/api/name/`, payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: '用户名已存在',
            description: '请选择另一个用户名。',
            variant: 'destructive',
          })
        }
      }

      return toast({
        title: '错误',
        description: '更新用户名时出错，请稍后再试。',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        description: '已更新',
      })
      router.refresh()
    },
  })

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => updateUsername(e))}
      {...props}>
      <Card>
        <CardHeader>
          <CardTitle>你的名字</CardTitle>
          <CardDescription>
            请输入一个用户名，该用户名将用于您的个人资料页面和评论。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='relative grid gap-1'>
            <div className='absolute top-0 left-0 w-8 h-10 grid place-items-center'>
              <span className='text-sm text-zinc-400'>u/</span>
            </div>
            <Label className='sr-only' htmlFor='name'>
              用户名
            </Label>
            <Input
              id='name'
              className='w-[400px] pl-6'
              size={32}
              {...register('name')}
            />
            {errors?.name && (
              <p className='px-1 text-xs text-red-600'>{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className='gap-2'>
          <Button isLoading={isLoading}>更改名字</Button>
          <Link href='/' className={buttonVariants()}>返回主页</Link>
        </CardFooter>
      </Card>
    </form>
  )
}