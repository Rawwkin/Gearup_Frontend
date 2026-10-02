import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonStyles } from "@/lib/button-styles";

const Pagination = ({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={buttonStyles({ variant: "outline" })}>
          <ChevronLeft className="size-4" aria-hidden="true" />
          Previous
        </Link>
      ) : (
        <span />
      )}
      <p className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={buttonStyles({ variant: "outline" })}>
          Next
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
};

export default Pagination;
