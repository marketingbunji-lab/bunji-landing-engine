import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function TestUsersPage() {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, created_at")
    .limit(10);

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Error conectando con Supabase</h1>
        <pre>{error.message}</pre>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Usuarios desde Supabase</h1>

      {data?.map((user) => (
        <div key={user.id}>
          <strong>{user.name}</strong>
          <br />
          <small>{user.created_at}</small>
        </div>
      ))}
    </main>
  );
}
