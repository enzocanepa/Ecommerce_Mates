import { createClient } from "npm:@supabase/supabase-js@2";

export function makeSupabase() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
}

export async function getAuthUser(authHeader: string | undefined) {
  const token = authHeader?.split(' ')[1];
  if (!token) return null;
  const supabase = makeSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function requireAuth(c: any) {
  const user = await getAuthUser(c.req.header('Authorization'));
  if (!user) {
    c.status(401);
    return null;
  }
  return user;
}

export async function requireAdmin(c: any) {
  const user = await requireAuth(c);
  if (!user) return null;
  if (user.user_metadata?.role !== 'admin') {
    c.status(403);
    return null;
  }
  return user;
}
