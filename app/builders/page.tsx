import { SiteHeader } from "@/components/site-header";
import { BuilderCard } from "@/components/builder-card";
import { listBuilders } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Builders" };

export default async function BuildersPage() {
  const builders = await listBuilders();
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold">Builders</h1>
        <p className="mt-1 text-white/60">
          Nigerian builders shipping in public.
        </p>
        {builders.length === 0 ? (
          <div className="mt-16 text-center text-white/50">
            <p className="text-lg">No builders yet — you could be the first! 🚀</p>
            <p className="mt-1 text-sm">Sign in to create your profile.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {builders.map((b) => (
              <BuilderCard key={b.id} profile={b} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
