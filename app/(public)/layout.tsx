import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />

      <section className="min-h-screen 2xl:min-h-[calc(100vh-173px)] max-w-[80%] mx-auto flex items-center justify-center overflow-clip">
        {children}
      </section>

      <Footer />
    </>
  );
}
