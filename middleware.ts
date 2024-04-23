import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is signed in and the current path is / redirect the user to /account
  // ユーザーがサインインしていて、現在のパスが次の場合 / ユーザーを /account にリダイレクトします
  // if (user && req.nextUrl.pathname === '/') {
  //   return NextResponse.redirect(new URL('/account', req.url))
  // }

  if (!user && req.nextUrl.pathname !== '/sign') {
    return NextResponse.redirect(new URL('/sign', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/sign'],
}