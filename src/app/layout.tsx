import SupabaseListener from "@/components/navigation/supabaseListener";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="ja">
        <body>
          <main>{children}</main>
          <SupabaseListener />
        </body>
      </html>
    </>
  );
}
