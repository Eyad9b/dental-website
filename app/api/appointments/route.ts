import { NextResponse } from 'next/server';
import { appointmentSchema } from '@/lib/appointment-schema';
import { createPublicSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Your request could not be read. Please try again.' }, { status: 400 });
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Please check the form and try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Booking is temporarily unavailable. Please call us.' }, { status: 503 });
  }

  const data = parsed.data;
  const { error } = await supabase.from('appointments').insert({
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    preferred_date: data.preferredDate,
    treatment: data.treatment,
    message: data.message || null,
  });

  if (error) {
    console.error('Failed to save appointment request', error.message);
    return NextResponse.json(
      { error: 'We could not save your request. Please try again or call us.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
