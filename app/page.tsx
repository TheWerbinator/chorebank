import { Hero } from "@/components/hero";
import Link from "next/link";
import { TutorialStep } from "@/components/tutorial/tutorial-step";

export default function Home() {
  return (
    <div className='flex-1 flex flex-col gap-20 max-w-5xl p-5'>
      <Hero />
      <main className='flex-1 flex flex-col gap-6 px-4'>
        <h2 className='font-medium text-xl mb-4'>Usage steps</h2>

        <ol className='flex flex-col gap-6'>
          <TutorialStep title='Sign Up for a Parent Account'>
            <p>
              Head over to the{" "}
              <Link
                href='auth/sign-up'
                className='font-bold hover:underline text-foreground/80'
              >
                Sign up
              </Link>{" "}
              page and sign up your parent user. This will give you access to
              the Parent Dashboard.
            </p>
          </TutorialStep>
          <TutorialStep title='Create a Child Account'>
            <p>
              Create a child account and copy your unique child page link. Make
              sure not to share your link with anyone you do not want doing your
              chores!
            </p>
          </TutorialStep>
          <TutorialStep title='Start Building Chores'>
            <p>
              Create and assign chores (and their associated rewards!) to any
              child connected to your account. They will automatically be
              notified of the assignment.
            </p>
          </TutorialStep>
        </ol>
      </main>
    </div>
  );
}
