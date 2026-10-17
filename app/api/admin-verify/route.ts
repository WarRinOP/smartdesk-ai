import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { allowAdminAttempt, isValidAdminCode, GuardConfig } from '@/lib/usage-guard'

const GUARD: GuardConfig = { prefix: 'sd', limit: 10, noun: 'messages' }

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
    }
    // Limit guessing: a few tries per hour per network address.
    const allowed = await allowAdminAttempt(req, createServerSupabaseClient(), GUARD)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
    }
    const { code } = await req.json()
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }
    if (isValidAdminCode(code.trim())) {
      return NextResponse.json({ valid: true }, { status: 200 })
    }
    return NextResponse.json({ valid: false, error: 'Invalid code' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
