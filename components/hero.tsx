import { NextLogo } from "./next-logo";
import { SupabaseLogo } from "./supabase-logo";

export function Hero() {
  return (
    <div className='flex flex-col gap-16 items-center'>
      <h1 className='sr-only'>
        ChoreBank: A Project with Next.js and Supabase
      </h1>
      <span className='flex gap-2 items-center flex-wrap text-2xl lg:text-3xl !leading-tight mx-auto max-w-3xl text-center'>
        ChoreBank: A Project with
        <a href='https://nextjs.org/' target='_blank' rel='noreferrer'>
          <NextLogo />
        </a>
        and
        <a
          href='https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs'
          target='_blank'
          rel='noreferrer'
        >
          <SupabaseLogo />
        </a>
      </span>
      <div className='w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8' />
    </div>
  );
}
