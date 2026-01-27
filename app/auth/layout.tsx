export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="min-h-screen max-w-[90%] mx-auto flex items-center justify-center overflow-clip">
      {children}
    </section>
  );
}
