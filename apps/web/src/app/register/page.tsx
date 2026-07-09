import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/** Registro con selector de rol buyer/seller. */
export default function RegisterPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <AuthForm mode="register" />
      </Suspense>
    </AuthLayout>
  );
}
