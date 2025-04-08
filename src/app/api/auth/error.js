import { useRouter } from "next/router";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className="min-h-screen flex items-center justify-center bg-space-black text-stellar-white">
      <div className="p-8 bg-midnight-blue rounded-2xl shadow-md max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Authentication Error</h1>
        <p className="text-center">
          {error ? `Error: ${error}` : "An unknown error occurred. Please try again."}
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-6 w-full bg-glow-cyan text-space-black py-4 rounded-lg font-semibold"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}