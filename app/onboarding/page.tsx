import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SiteHeader } from "@/components/site-header";
import { OnboardingForm } from "@/components/onboarding-form";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Finish setting up" };

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // getCurrentProfile self-heals, so in the common case a profile already
  // exists (or is created here) and we send the user straight to their
  // dashboard. We only render the claim form when the automatic path failed.
  const profile = await getCurrentProfile();
  if (profile) redirect("/dashboard");

  const user = await currentUser();
  const defaultHandle = (user?.username || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 30);
  const defaultName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "";

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-md px-6 py-14">
        <h1 className="text-3xl font-bold">Finish setting up</h1>
        <p className="mt-2 text-white/60">
          Pick a handle to claim your builder profile. You can change your display name
          and the rest later.
        </p>
        <OnboardingForm defaultHandle={defaultHandle} defaultName={defaultName} />
      </section>
    </main>
  );
}
