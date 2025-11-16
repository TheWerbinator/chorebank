import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Track Chores",
      description:
        "Manage all your family chores in one place with ease and clarity.",
    },
    {
      title: "Assign Rewards",
      description:
        "Give points or rewards for completed chores to keep motivation high.",
    },
    {
      title: "Easy Access",
      description:
        "Children can check their tasks and rewards with a secure, simple link.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-24 max-w-5xl mx-auto p-6">
      <main className="flex flex-col gap-20 px-4">

        {/* Hero Section */}
<section className="text-center flex flex-col gap-4 p-12 md:p-24 shadow-lg text-white bg-rotating-gradient relative">
  <h2 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
    Make Chores Fun & Rewarding
  </h2>
  <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed drop-shadow-sm">
    Track chores, assign rewards, and help your family stay organized — all in one easy-to-use app.
  </p>
  <div className="flex justify-center gap-4 mt-6 flex-wrap">
    <Link
      href="/auth/sign-up"
      className="bg-white hover:bg-purple-100 rounded-lg border border-purple-600 dark:border-purple-500 text-purple-700 dark:bg-purple-500 dark:text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-white-200 dark:hover:bg-purple-400 transition-colors"
    >
      Get Started
    </Link>
    <Link
      href="/auth/login"
      className="px-6 py-3 rounded-lg border border-white/80 text-white dark:border-white/60 dark:text-white flex items-center justify-center shadow-sm hover:bg-white/20  dark:hover:bg-white/10 transition-all"
    >
      Login
    </Link>
  </div>
</section>

 <div className="grid md:grid-cols-3 gap-8 text-center">
          {features.map((feat, idx) => (
            <div
              key={feat.title}
              className={`bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all animate-fadeIn`}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <h3 className="text-2xl font-bold mb-2 text-purple-700 dark:text-purple-400 drop-shadow-sm">
                {feat.title}
              </h3>
              <p className="text-gray-800 dark:text-gray-300">{feat.description}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
