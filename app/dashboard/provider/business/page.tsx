import type { Metadata } from "next";
import BusinessProfileForm from "@/app/ui/provider/BusinessProfileForm";

export const metadata: Metadata = { title: "Business profile" };

const BusinessProfilePage = () => {
  return <BusinessProfileForm />;
};

export default BusinessProfilePage;
