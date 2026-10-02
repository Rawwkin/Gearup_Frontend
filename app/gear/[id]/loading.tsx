import Container from "@/app/ui/Container";
import Skeleton from "@/app/ui/Skeleton";

const GearDetailLoading = () => {
  return (
    <Container className="py-10">
      <Skeleton className="h-4 w-56" />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </Container>
  );
};

export default GearDetailLoading;
