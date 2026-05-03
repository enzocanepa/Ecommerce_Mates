import { Hono } from "npm:hono";
import { makeSupabase, requireAuth } from "../middleware/auth.ts";
import { sendEmail, welcomeEmailHtml } from "../services/email.ts";

const authRoutes = new Hono();

authRoutes.get("/health", (c) => c.json({ status: "ok" }));

authRoutes.post("/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const supabase = makeSupabase();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'user' },
      email_confirm: true,
    });

    if (error) return c.json({ error: error.message }, 400);

    sendEmail(email, '¡Bienvenido/a a Mates Aconcagua! 🧉', welcomeEmailHtml(name));

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

export { authRoutes };
