import Skeleton from "@/app/ui/Skeleton";

const ListSkeleton = ({ rows = 4, stats = false }: { rows?: number; stats?: boolean }) => {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-9 w-56" />
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-24" />
      ))}
    </div>
  );
};

export default ListSkeleton;
