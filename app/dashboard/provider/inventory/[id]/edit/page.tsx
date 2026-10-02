import type { Metadata } from "next";
import PageHeader from "@/app/ui/PageHeader";
import GearFormLoader from "@/app/ui/provider/GearFormLoader";

export const metadata: Metadata = { title: "Edit gear" };

const EditGearPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div>
      <PageHeader title="Edit gear" description="Update the details, pricing or stock of this listing." />
      <GearFormLoader gearId={id} />
    </div>
  );
};

export default EditGearPage;
