export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-green-500" />
      <p className="text-sm text-white/40">Loading… hold body 🚢</p>
    </main>
  );
}
