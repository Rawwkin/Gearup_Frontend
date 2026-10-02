"use client";

import { useCallback, useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import Modal from "@/app/ui/Modal";
import { RatingInput } from "@/app/ui/Rating";
import Textarea from "@/app/ui/Textarea";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { useToast } from "@/app/ui/ToastProvider";
import { gearApi, reviewsApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/http";
import { useAsync } from "@/hooks/useAsync";

/** "Write a review" button for a returned item; shows the existing rating if already reviewed. */
const ReviewAction = ({ gearItemId, gearName }: { gearItemId: string; gearName: string }) => {
  const toast = useToast();
  const { user } = useAuth();

  const fetchGear = useCallback(() => gearApi.get(gearItemId), [gearItemId]);
  const { data: gear, loading, reload } = useAsync(fetchGear);

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const existing = gear?.reviews?.find((review) => review.userId === user?.id);

  if (existing) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
        <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
        Reviewed · {existing.rating}/5
      </span>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating < 1) {
      setError("Choose a star rating.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await reviewsApi.create({
        gearItemId,
        rating,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      });
      toast.success("Thanks for your review!");
      setOpen(false);
      setRating(0);
      setComment("");
      reload();
    } catch (submitError) {
      setError(getErrorMessage(submitError, "We couldn't submit your review."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)} disabled={loading && !gear}>
        Write review
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Review ${gearName}`}
        description="Share how the gear worked out for others."
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && <Alert variant="error">{error}</Alert>}
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Your rating</p>
            <RatingInput value={rating} onChange={setRating} />
          </div>
          <Textarea
            label="Comment (optional)"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={1000}
            placeholder="What did you like? Anything to improve?"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Submit review
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ReviewAction;
