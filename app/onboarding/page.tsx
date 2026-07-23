import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/ui/page-header";
import { OnboardingForm } from "@/components/onboarding-form";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Welcome to ShipNaija" };

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await getCurrentProfile();
  if (!profile) redirect("/onboarding");

  // Already onboarded (or has a meaningful profile) — skip past this page.
  // The self-heal path's claimProfile stamps onboarded_at, so users in the
  // handle-collision flow land on the dashboard instead of looping.
  if (profile.onboarded_at) redirect("/dashboard");

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-2xl px-6 py-14">
        <PageHeader
          eyebrow="Welcome to ShipNaija 🚢"
          title="Let's set up your builder profile"
          subtitle="Tell the community who you are and what you build. Everything is optional — you can always update later from your profile."
        />
        <OnboardingForm
          defaultName={profile.display_name !== "Builder" ? profile.display_name : ""}
          defaultStack={profile.tech_stack ?? []}
        />
      </section>
    </main>
  );
}
