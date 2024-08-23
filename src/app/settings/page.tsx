import { redirect } from 'next/navigation'

import { auth, } from '@/lib/auth'
import {UserNameForm }from '@/components/UserNameForm';

export const metadata = {
  title: '设置',
  description: '管理你的用户信息',
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className='max-w-4xl mx-auto py-12'>
      <div className='grid items-start gap-8'>
        <h1 className='font-bold text-3xl md:text-4xl'>设置</h1>

        <div className='grid gap-10'>
          <UserNameForm
            user={{
              id: session.user.id,
              name: session.user.name || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}