import Spinner from "@/app/ui/Spinner";

const Loading = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-brand-700" role="status">
      <Spinner className="size-8" />
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default Loading;
