import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/onboarding");

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold">Edit profile</h1>
        <ProfileEditForm profile={profile} />
      </section>
    </main>
  );
}
