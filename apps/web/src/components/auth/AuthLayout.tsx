/** Layout centrado para pantallas de autenticación. */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
