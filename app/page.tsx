import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col gap-24 max-w-5xl mx-auto p-6">
      <main className="flex flex-col gap-16 px-4">

        {/* Hero Section */}
        <section className="text-center flex flex-col gap-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground dark:text-foreground-dark">
            Make Chores Fun & Rewarding
          </h2>
          <p className="text-foreground/80 dark:text-foreground-dark/80 max-w-2xl mx-auto text-lg leading-relaxed">
            Track chores, assign rewards, and help your family stay organized — all
            in one easy-to-use app.
          </p>
         <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <Link
              href="/auth/sign-up"
              className="bg-purple-600 hover:bg-purple-500 dark:bg-purple-500 dark:hover:bg-purple-400 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
                className="px-6 py-2 rounded-lg border border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-700 transition-colors"
            >
              Login
            </Link>
          </div>

        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-card bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold mb-2 text-foreground dark:text-foreground-dark">
              Track Chores
            </h3>
            <p className="text-foreground/80 dark:text-foreground-dark/80">
              Manage all your family chores in one place with ease and clarity.
            </p>
          </div>
          <div className="bg-card bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold mb-2 text-foreground dark:text-foreground-dark">
              Assign Rewards
            </h3>
            <p className="text-foreground/80 dark:text-foreground-dark/80">
              Give points or rewards for completed chores to keep motivation high.
            </p>
          </div>
          <div className="bg-card bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold mb-2 text-foreground dark:text-foreground-dark">
              Easy Access
            </h3>
            <p className="text-foreground/80 dark:text-foreground-dark/80">
              Children can check their tasks and rewards with a secure, simple link.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
