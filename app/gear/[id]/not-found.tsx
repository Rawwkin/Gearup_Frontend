import Link from "next/link";
import Container from "@/app/ui/Container";
import EmptyState from "@/app/ui/EmptyState";
import { buttonStyles } from "@/lib/button-styles";

const GearNotFound = () => {
  return (
    <Container className="py-16">
      <EmptyState
        title="We couldn't find that gear"
        description="It may have been removed by the provider."
        action={
          <Link href="/gear" className={buttonStyles()}>
            Browse all gear
          </Link>
        }
      />
    </Container>
  );
};

export default GearNotFound;
