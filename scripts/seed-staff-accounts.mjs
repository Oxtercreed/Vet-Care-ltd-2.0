import pg from "pg";

const SUPABASE_URL = "https://lzsuegnnzhljiiqyedqq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c3VlZ25uemhsamlpcXllZHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2Njc1OTgsImV4cCI6MjEwNzI0MzU5OH0.39bBjtMY76uZkkHX3bKaeaA3eBeL72oIJmKHVnXl6pY";
const DATABASE_URL = "postgresql://postgres.lzsuegnnzhljiiqyedqq:lpy3PKhwp7XVr28c@aws-0-eu-west-1.pooler.supabase.com:6543/postgres";

async function createAuthUser(client, { email, password, name, role, title }) {
  console.log(`Setting up account for ${email}...`);
  
  // 1. Check if user already exists
  const existing = await client.query("SELECT id FROM auth.users WHERE email = $1", [email.toLowerCase()]);
  let userId;

  if (existing.rows.length > 0) {
    userId = existing.rows[0].id;
    console.log(`User ${email} already exists with id ${userId}. Updating password...`);
    await client.query(
      `UPDATE auth.users 
       SET encrypted_password = extensions.crypt($1, extensions.gen_salt('bf')),
           email_confirmed_at = now(),
           updated_at = now(),
           raw_user_meta_data = jsonb_build_object('name', $2::text)
       WHERE id = $3`,
      [password, name, userId]
    );
    await client.query(
      `INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        $1::uuid,
        jsonb_build_object('sub', $1::text, 'email', $2::text),
        'email',
        $1::text,
        now(),
        now(),
        now()
      )
      ON CONFLICT (provider, provider_id) DO UPDATE SET
        updated_at = now(),
        identity_data = excluded.identity_data`,
      [userId, email.toLowerCase()]
    );
  } else {
    // Insert new auth user with confirmed email
    const insertRes = await client.query(
      `INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        phone_change,
        phone_change_token,
        email_change_token_current,
        reauthentication_token,
        phone,
        created_at,
        updated_at
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        $1,
        extensions.crypt($2, extensions.gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('name', $3::text),
        false,
        '', '', '', '', '', '', '', '', '',
        now(),
        now()
      ) RETURNING id`,
      [email.toLowerCase(), password, name]
    );
    userId = insertRes.rows[0].id;
    console.log(`Created auth user ${email} with id ${userId}`);

    // Insert identity
    await client.query(
      `INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        $1::uuid,
        jsonb_build_object('sub', $1::text, 'email', $2::text),
        'email',
        $1::text,
        now(),
        now(),
        now()
      )`,
      [userId, email.toLowerCase()]
    );
  }

  // 2. Link / upsert in public.salon_staff table
  await client.query(
    `INSERT INTO public.salon_staff (
      id,
      name,
      title,
      role,
      email,
      active
    ) VALUES (
      $1, $2, $3, $4, $5, true
    )
    ON CONFLICT (id) DO UPDATE SET
      name = excluded.name,
      title = excluded.title,
      role = excluded.role,
      email = excluded.email,
      active = true`,
    [userId, name, title, role, email.toLowerCase()]
  );

  // 3. Upsert in public."user" to satisfy foreign key for salon_staff_accounts
  await client.query(
    `INSERT INTO public."user" (
      id, name, email, "emailVerified", "createdAt", "updatedAt"
    ) VALUES (
      $1::text, $2, $3, true, now(), now()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = excluded.name,
      email = excluded.email`,
    [userId, name, email.toLowerCase()]
  );

  // 4. Also upsert in salon_staff_accounts
  await client.query(
    `INSERT INTO public.salon_staff_accounts (
      id,
      email,
      name,
      role,
      team_member_id,
      active
    ) VALUES (
      $1, $2, $3, $4, $1, true
    )
    ON CONFLICT (id) DO UPDATE SET
      email = excluded.email,
      name = excluded.name,
      role = excluded.role,
      active = true`,
    [userId, email.toLowerCase(), name, role]
  );

  console.log(`Successfully configured ${role} account: ${email}`);
  return userId;
}

async function verifyLogin(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.toLowerCase(), password }),
  });
  const data = await res.json();
  if (res.ok && data.access_token) {
    console.log(`[LOGIN VERIFIED] Successfully logged in as ${email}! Token received.`);
    return true;
  } else {
    console.error(`[LOGIN FAILED] ${email}:`, data);
    return false;
  }
}

async function main() {
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  // Create Staff account (for testing staff portal and notifications)
  await createAuthUser(client, {
    email: "staff@vetcare.co.tz",
    password: "VetCareStaff2026!",
    name: "Dr. Amina Hassan",
    role: "stylist",
    title: "Lead Veterinarian"
  });

  // Create Admin account (for full clinic administration)
  await createAuthUser(client, {
    email: "admin@vetcare.co.tz",
    password: "VetCareAdmin2026!",
    name: "Vet Care Admin",
    role: "admin",
    title: "Clinic Administrator"
  });

  await client.end();

  // Test both logins via REST API
  console.log("\nVerifying credentials against Supabase Auth API...");
  await verifyLogin("staff@vetcare.co.tz", "VetCareStaff2026!");
  await verifyLogin("admin@vetcare.co.tz", "VetCareAdmin2026!");
}

main().catch(console.error);
