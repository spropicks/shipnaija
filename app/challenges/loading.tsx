import { Skeleton, PageHeaderSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <PageHeaderSkeleton />
        <Skeleton className="mt-8 h-40 w-full rounded-xl" />
        <Skeleton className="mt-12 h-6 w-40" />
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </section>
    </main>
  );
}
