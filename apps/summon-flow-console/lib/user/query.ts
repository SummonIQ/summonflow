import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db/client';

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await (await import('next/headers')).headers(),
    });

    if (!session || !session.user) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    return user;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '';
    const isPrerenderError = errorMessage.includes('prerender') || errorMessage.includes('headers()');

    if (!isPrerenderError) {
      console.error('Authentication error:', error);
    }
    return null;
  }
}

export async function getSessionUser() {
  try {
    const session = await auth.api.getSession({
      headers: await (await import('next/headers')).headers(),
    });
    return session?.user ?? null;
  } catch {
    return null;
  }
}
