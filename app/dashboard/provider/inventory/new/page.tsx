import type { Metadata } from "next";
import PageHeader from "@/app/ui/PageHeader";
import GearFormLoader from "@/app/ui/provider/GearFormLoader";

export const metadata: Metadata = { title: "Add gear" };

const NewGearPage = () => {
  return (
    <div>
      <PageHeader title="Add gear" description="Create a new listing for renters to find." />
      <GearFormLoader />
    </div>
  );
};

export default NewGearPage;
