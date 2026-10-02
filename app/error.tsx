"use client";

import { useEffect } from "react";
import Container from "@/app/ui/Container";
import ErrorState from "@/app/ui/ErrorState";
import Button from "@/app/ui/Button";

const ErrorPage = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <ErrorState
        title="Something went wrong"
        message="An unexpected error occurred. You can try again, or come back in a moment."
        action={<Button onClick={() => unstable_retry()}>Try again</Button>}
      />
    </Container>
  );
};

export default ErrorPage;
