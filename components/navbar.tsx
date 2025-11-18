"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

export default function NavBar() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [supabase.auth]);

  const isChildPage = pathname.startsWith("/child/");

  return (
    <nav className='w-full border-b border-gray-300/20 dark:border-gray-700/20 bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur-sm fixed top-0 z-50'>
      <div className='max-w-5xl mx-auto flex justify-between items-center h-16 px-4 sm:px-5'>
        <Link
          href={
            pathname === "/dashboard" ? "/dashboard" : isChildPage ? "#" : "/"
          }
          className='font-extrabold text-lg md:text-xl text-gray-800 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors'
        >
          ChoreBank
        </Link>
        {!isChildPage ? (
          <div className='flex items-center gap-2 md:gap-4'>
            {!session ? (
              <>
                <Link
                  href='/auth/sign-up'
                  className='px-3 py-1 md:px-4 md:py-2 rounded-lg bg-purple-600 dark:bg-purple-500 text-white font-semibold text-xs md:text-sm hover:bg-purple-500 dark:hover:bg-purple-400 transition-colors'
                >
                  Get Started
                </Link>
                <Link
                  href='/auth/login'
                  className='px-3 py-1 md:px-4 md:py-2 rounded-lg border border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 font-semibold text-xs md:text-sm hover:bg-purple-100 dark:hover:bg-purple-600 dark:hover:text-white transition-colors'
                >
                  Login
                </Link>
              </>
            ) : (
              <LogoutButton />
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
}
