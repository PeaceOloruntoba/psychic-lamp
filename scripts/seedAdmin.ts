/**
 * Creates an admin login for the Vozaro Admin Dashboard.
 *
 * Usage:
 *   npm run seed:admin -- --email you@example.com --password "StrongPass123!" --name "Admin Name"
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL to be set
 * (either in your shell env or in a .env.local file — this script loads
 * .env.local automatically).
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { existsSync } from "fs";

if (existsSync(".env.local")) config({ path: ".env.local" });
else config();

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

async function main() {
  const email = getArg("--email");
  const password = getArg("--password");
  const name = getArg("--name") ?? "Admin";

  if (!email || !password) {
    console.error(
      '\nUsage: npm run seed:admin -- --email you@example.com --password "StrongPass123!" --name "Admin Name"\n'
    );
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "\nMissing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local first.\n"
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Creating admin user: ${email} ...`);

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId = created?.user?.id;

  if (createError) {
    // If the user already exists in Supabase Auth, just look them up and
    // proceed to whitelist them in admin_users.
    if (createError.message?.toLowerCase().includes("already")) {
      console.log("User already exists in Supabase Auth — looking them up...");
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users.find((u) => u.email === email);
      if (!existing) {
        console.error("Could not find the existing user. Aborting.");
        process.exit(1);
      }
      userId = existing.id;
    } else {
      console.error("Failed to create auth user:", createError.message);
      process.exit(1);
    }
  }

  if (!userId) {
    console.error("No user id resolved. Aborting.");
    process.exit(1);
  }

  const { error: insertError } = await supabase
    .from("admin_users")
    .upsert({ id: userId, email, full_name: name }, { onConflict: "id" });

  if (insertError) {
    console.error("Failed to whitelist admin:", insertError.message);
    process.exit(1);
  }

  console.log(`\n✅ Admin ready. Sign in at /admin/login with:\n   Email: ${email}\n   Password: (the one you provided)\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
