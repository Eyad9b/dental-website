import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contact-schema';
import { createPublicSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Your message could not be read. Please try again.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Please check the form and try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Messaging is temporarily unavailable. Please call us.' }, { status: 503 });
  }

  const { error } = await supabase.from('contact_messages').insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    console.error('Failed to save contact message', error.message);
    return NextResponse.json(
      { error: 'We could not send your message. Please try again or call us.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
