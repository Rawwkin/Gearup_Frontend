import Container from "@/app/ui/Container";
import Skeleton from "@/app/ui/Skeleton";

const GearLoading = () => {
  return (
    <Container className="py-10">
      <Skeleton className="h-9 w-64" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <Skeleton className="h-96" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default GearLoading;
