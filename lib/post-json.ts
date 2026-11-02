export type SubmitResult = { ok: true } | { ok: false; error: string };

export async function postJson(url: string, body: unknown): Promise<SubmitResult> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = (await response.json().catch(() => null)) as { error?: unknown } | null;
    if (!response.ok) {
      const error = typeof payload?.error === 'string' ? payload.error : 'Something went wrong. Please try again.';
      return { ok: false, error };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'We could not reach the server. Check your connection and try again.' };
  }
}
