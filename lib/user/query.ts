import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db/client';
import { ensureOrganizationContext } from '@/lib/organization';

export async function getCurrentUser() {
  try {
    const context = await ensureOrganizationContext();
    if (!context) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id: context.user.id },
    });

    return {
      ...user,
      activeOrganization: context.organization,
      activeMembership: context.member,
    };
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
