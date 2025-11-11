import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { TutorialStep } from "@/components/tutorial/tutorial-step";

export default function Home() {
  return (
    <main className='min-h-screen flex flex-col items-center'>
      <div className='flex-1 w-full flex flex-col gap-20 items-center'>
        <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
          <div className='w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm'>
            <div className='flex gap-5 items-center font-semibold'>
              <Link href={"/"}>ChoreBank</Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className='flex-1 flex flex-col gap-20 max-w-5xl p-5'>
          <Hero />
          <main className='flex-1 flex flex-col gap-6 px-4'>
            <h2 className='font-medium text-xl mb-4'>Usage steps</h2>

            <ol className='flex flex-col gap-6'>
              <TutorialStep title='Sign up your first user'>
                <p>
                  Head over to the{" "}
                  <Link
                    href='auth/sign-up'
                    className='font-bold hover:underline text-foreground/80'
                  >
                    Sign up
                  </Link>{" "}
                  page and sign up your parent user. This will give you access
                  to a share link to sign up child accounts, or you can manually
                  create one yourself.
                </p>
              </TutorialStep>
              <TutorialStep title='Create a Child Account'>
                <p>
                  Manually create a child account or share your unique child
                  account setup link. Make sure not to share your link with
                  anyone you do not want creating an account!
                </p>
              </TutorialStep>
              <TutorialStep title='Start Building Chores'>
                <p>
                  Create and assign chores (and their associated rewards!) to
                  any child connected to your account. They will automatically
                  be notified of the assignment.
                </p>
              </TutorialStep>
            </ol>
          </main>
        </div>

        <footer className='w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16'>
          <p>
            2420 Project by{" "}
            <a
              href='https://www.linkedin.com/in/connorspendlove/'
              target='_blank'
              className='font-bold hover:underline'
              rel='noreferrer'
            >
              Connor Spendlove
            </a>{" "}
            and{" "}
            <a
              href='https://www.linkedin.com/in/shawn-werber/'
              target='_blank'
              className='font-bold hover:underline'
              rel='noreferrer'
            >
              Shawn Werber
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
