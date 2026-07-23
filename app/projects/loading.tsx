import { PageHeaderSkeleton, CardGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <PageHeaderSkeleton />
        <CardGridSkeleton />
      </section>
    </main>
  );
}
