import type { Metadata } from "next";
import ProfileView from "@/app/ui/dashboard/ProfileView";

export const metadata: Metadata = { title: "Account" };

const ProfilePage = () => {
  return <ProfileView />;
};

export default ProfilePage;
