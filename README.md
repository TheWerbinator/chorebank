# 💰 ChoreBank: Effortless Chore Management for Families

**ChoreBank** is a simple, intuitive application designed to help parents manage, assign, and track chores for their children using a digital reward system. Built using the powerful **Next.js** framework and **Supabase** for backend services, ChoreBank focuses on ease of use for parents while providing a secure, no-login dashboard for children.

## ✨ Features

  * **Parent Dashboard:** Full authentication and control for parents to manage the family's ecosystem.
  * **Child Management:** Easily add and view child profiles, tracking their rewards and earnings.
  * **Chore Assignment:** Create new chores with descriptions and reward amounts, and assign them to specific children.
  * **Approval Queue:** Parents can approve or reject completed chores before rewards are issued.
  * **Simplified Child Access:** Children access their personal dashboard securely using a unique **Access Key** link, eliminating the need for separate accounts, passwords, or complex sign-up flows.
  * **Reward Tracking:** Monitor `current_rewards` (unspent earnings) and `lifetime_rewards` for each child.


  <img alt="A mother adds a gold coin to a piggy bank while her son cheers in the background." src="https://chorebank.vercel.app/chorebank.png">
-----

## 🛠️ Technology Stack

ChoreBank is built with a modern, scalable stack:

| Technology | Description | Resource Link |
| :--- | :--- | :--- |
| **Next.js** | React framework for production, enabling server-side rendering (SSR) and routing. | [Next.js Documentation](https://nextjs.org/docs) |
| **TypeScript** | Adds static type checking to JavaScript, improving code quality and maintainability. | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| **Supabase** | Open Source Firebase alternative providing Database, Authentication, and Edge Functions. | [Supabase Documentation](https://supabase.com/docs) |
| **Tailwind CSS** | A utility-first CSS framework for rapidly building custom designs. | [Tailwind CSS Docs](https://tailwindcss.com/docs) |
| **React Hook Form / Zod** | Used for form management and schema validation. | [React Hook Form](https://react-hook-form.com/) |
| **shadcn** | All-purpose component library for quick development | [shadcn](https://https://ui.shadcn.com/) |

-----

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

You must have **Node.js** and **npm** (or yarn/pnpm) installed.

### 1\. Installation

Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone [YOUR_REPO_URL] chorebank
cd chorebank

# Install dependencies using npm
npm install
```

### 2\. Configure Supabase

1.  **Create a New Supabase Project:** Sign up or log in to [Supabase](https://supabase.com/).

2.  **Get Environment Variables:** Navigate to **Project Settings** \> **API**. You will need the **Project URL**, **Service Role Key**, and the **Publishable Key**.

3.  **Create `.env.local`:** In the root of your project directory, create a file named `.env.local` and add the following variables:

    ```bash
    # Supabase Credentials
    SUPABASE_SERVICE_ROLE_KEY="[YOUR_SUPABASE_SERVICE_ROLE_KEY]"
    NEXT_PUBLIC_SUPABASE_URL="[YOUR_SUPABASE_URL]"
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="[YOUR_SUPABASE_PUBLISHABLE_KEY]"
    ```

4.  **Set up Database Schema:** You must set up the `children` and `chores` tables, and implement **Row Level Security (RLS)** policies to ensure data is secure and users can only access their own family's data.

### 3\. Development Commands

Use the following commands to run or build the application:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server. The app will be available at `http://localhost:3000`. |
| `npm run build` | Compiles the production build of the Next.js application. |
| `npm start` | Starts the Next.js server in production mode (must run `npm run build` first). |

-----

## 👨‍👩‍👧‍👦 Application Data Flow

ChoreBank relies on a three-tier data model:

### 1\. Parents (Authenticated Users)

  * Parents are the primary users who manage the application.
  * **Authentication:** They use standard Supabase user authentication (sign up/login).
  * **Data Creation:** They create and own the `children` and `chores` data.
  * **Permissions:** RLS policies in Supabase ensure that a parent can only view/modify the data associated with their unique `user_id`.

### 2\. Children (Data Objects)

  * Children are database records (`children` table) linked to a parent's `user_id`.
  * They track rewards and display assigned/completed chores.
  * **No Authentication:** Children do not have accounts or passwords.

    Supabase `children` table includes the `name`, `parent` (user auth foreign key), `lifetime_rewards`, `current_rewards`, and `access_key` (generated uuid) columns.

### 3\. Chores (Data Objects)

  * Chores are database records (`chores` table) linked to a parent's `user_id` and a child's `id`.
  * They carry a reward value and display titles and descriptions for the chore to be completed.

    Supabase `chores` table includes the `title`, `description`, `reward`, `parent` (user auth foreign key), `assigned_child` (child foreign key), and `status` (enum of 'chore status' - either `assigned`, `pending_approval`, `rejected`, or `complete` ) columns.

-----

### Supabase RPC Function
The last thing you'll need to know is our super cool RPC function that runs the following SQL query - `increment_child_reward` - when called with the 'approveChore' parent action - 
```bash
DECLARE
  parent_id_check uuid;
  caller_uid uuid := auth.uid(); -- Get the caller's ID
BEGIN
  RAISE NOTICE '--- Increment Reward Function Start ---';
  RAISE NOTICE 'Child ID to reward: %', child_id_to_reward;
  RAISE NOTICE 'Amount to add: %', amount_to_add;
  RAISE NOTICE 'Caller (Parent) UID: %', caller_uid;

  -- 1. Find the parent of the child
  SELECT parent INTO parent_id_check
  FROM public.children
  WHERE id = child_id_to_reward;

  RAISE NOTICE 'Found Parent ID in table: %', parent_id_check;

  -- 2. Check if the logged-in user is that parent
  IF caller_uid = parent_id_check THEN
    RAISE NOTICE 'CHECK SUCCEEDED: Caller is the parent. Updating rewards...';
    -- 3. If yes, perform the atomic increment
    UPDATE public.children
    SET
      current_rewards = current_rewards + amount_to_add,
      lifetime_rewards = lifetime_rewards + amount_to_add
    WHERE id = child_id_to_reward;
    RAISE NOTICE 'Update complete.';
  ELSE
    -- 4. If no, raise an error or just log
    RAISE NOTICE 'CHECK FAILED: Caller is not the parent or parent is NULL.';
    RAISE EXCEPTION 'Unauthorized: You are not the parent of this child (or parent ID is NULL).';
  END IF;
  
  RAISE NOTICE '--- Increment Reward Function End ---';
END;

```

This allows the increment of current and lifetime child rewards to be done without three fetch requests.

-----

## 🤝 Contributing

Contributions are welcome\! Please feel free to open an [issue](https://github.com/TheWerbinator/chore-bank/issues) or submit a [pull request](https://github.com/TheWerbinator/chore-bank/pulls) if you have suggestions for features, bug fixes, or improvements to the codebase.