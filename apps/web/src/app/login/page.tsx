import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/** Login email + password. */
export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthLayout>
  );
}
