import { SiteHeader } from "@/components/site-header";
import { BuildersExplorer } from "@/components/builders-explorer";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { listBuilders } from "@/lib/queries";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Builders" };

export default async function BuildersPage() {
  const builders = await listBuilders();
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <PageHeader
          eyebrow="The community"
          title="Builders"
          subtitle="Nigerian builders shipping in public."
        />
        {builders.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={Users}
              title="No builders yet"
              description="You could be the first. Sign in to create your profile."
            />
          </div>
        ) : (
          <BuildersExplorer builders={builders} />
        )}
      </section>
    </main>
  );
}
