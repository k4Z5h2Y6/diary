import SupabaseListener from "@/components/navigation/supabaseListener";
import "./globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
