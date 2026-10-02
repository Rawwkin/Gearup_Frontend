import Rating from "@/app/ui/Rating";
import { formatDate, initials } from "@/lib/format";
import type { Review } from "@/types";

const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
        No reviews yet. Reviews appear here after customers have rented and returned this gear.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                {initials(review.user?.name ?? "Customer")}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {review.user?.name ?? "Customer"}
                </p>
                <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
              </div>
            </div>
            <Rating value={review.rating} />
          </div>
          {review.comment && <p className="mt-3 text-sm text-slate-700">{review.comment}</p>}
        </li>
      ))}
    </ul>
  );
};

export default ReviewList;
