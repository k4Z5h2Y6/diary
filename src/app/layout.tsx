import SupabaseListener from "@/components/supabaseListener";
import "./globals.css";
import { Navigation } from "@/components/navigation/navigation";

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
