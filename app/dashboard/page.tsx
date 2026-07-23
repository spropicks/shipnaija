import { Activity, ArrowRight } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";
import { MobileDashboard } from "@/components/mobile-dashboard";
import { DesktopDashboard } from "@/components/desktop-dashboard";
import { BlurFade } from "@/components/magicui/blur-fade";
import { OnboardingBanner } from "@/components/ui/onboarding-banner";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import { getCurrentProfile } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const me = await getCurrentProfile();

  if (!me) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <section className="relative mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
          <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-green-400/[0.08] blur-[100px]" />
          <BlurFade className="relative">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-green-400/15 bg-green-400/[0.07] text-green-300">
              <Activity className="size-6" />
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-green-400/70">
              Builder command center
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Your work. Your momentum.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/42">
              Track your streak, log what you shipped, follow your projects, and
              stay on top of the current Ship Week.
            </p>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-100">
                  Sign in to your dashboard
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </SignInButton>
            </SignedOut>
          </BlurFade>
        </section>
      </main>
    );
  }

  const data = await getDashboardData(me);

  // Checklist is shown as long as at least one of the 4 activation steps
  // is still incomplete. The dedicated welcome banner is layered above it
  // for users who haven't even filled their profile yet.
  const checklistDone =
    me.onboarded_at !== null &&
    data.viewerStats.projectCount > 0 &&
    data.viewerStats.logCount > 0 &&
    data.viewerStats.hasEngaged;
  const showChecklist = !checklistDone;
  const showBanner = me.onboarded_at === null;

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <SignedIn>
        {showBanner || showChecklist ? (
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pt-4 sm:px-6">
            {showBanner ? <OnboardingBanner /> : null}
            {showChecklist ? (
              <OnboardingChecklist
                profile={me}
                projectCount={data.viewerStats.projectCount}
                logCount={data.viewerStats.logCount}
                hasEngaged={data.viewerStats.hasEngaged}
              />
            ) : null}
          </div>
        ) : null}
      </SignedIn>
      <MobileDashboard me={me} data={data} />
      <DesktopDashboard me={me} data={data} />
    </main>
  );
}
