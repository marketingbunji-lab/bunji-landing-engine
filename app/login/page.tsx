import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-[#020617]">
      <div className="mx-auto max-w-md bg-white p-6 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">
          Login
        </h1>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
