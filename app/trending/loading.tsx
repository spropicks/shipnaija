import { Skeleton, PageHeaderSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <PageHeaderSkeleton />
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, col) => (
            <div key={col}>
              <Skeleton className="h-6 w-32" />
              <div className="mt-4 flex flex-col gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
