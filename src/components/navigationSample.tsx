"use client";
import type { Session } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ModalCore from "./modalCore";
import { ModalType } from "./modalType";

const NavigationSample = ({ session }: { session: Session | null }) => {
  const pathname = usePathname();
  const router = useRouter();
  if (session === null) {
    router.push("/login");
  }
  return (
    <header>
      <div className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
        <nav className="md:flex space-x-4">
          <div>
            <Link className="text-gray-600 hover:text-blue-600" href="/">
              Home
            </Link>
          </div>
          {session ? (
            <>
              <div>
                <Link
                  className="text-gray-600 hover:text-blue-600"
                  href="/profile"
                >
                  Profile
                </Link>
              </div>
              <div>
                <Link
                  className="text-gray-600 hover:text-blue-600"
                  href="/todo"
                >
                  Todo
                </Link>
              </div>
            </>
          ) : (
            <>
              <div>
                <ModalCore modalType={ModalType.SignIn}></ModalCore>
              </div>
              <div>
                <ModalCore modalType={ModalType.SignUp}></ModalCore>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavigationSample;


