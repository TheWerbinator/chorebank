# **ChoreBank System Design**

## **1\. Project Overview**

ChoreBank is a centralized platform designed to help parents track household chores and reward their children through a digital allowance system. The system addresses the lack of motivation in children and the difficulty parents face in tracking manual rewards by providing a clear, interactive dashboard for both user types.

## **2\. System Architecture**

The application utilizes the **Model-View-Controller (MVC)** architectural pattern to ensure a clear separation between data management, user interface, and business logic.

* **Model (Data Layer):** Managed via **Supabase**. This layer handles data persistence, relationships (foreign keys), and state management for Parents, Children, and Chores.  
* **View (UI Layer):** Built with **React** client components. This layer is responsible for rendering the dashboards and capturing user input (e.g., clicking "Complete" or "Approve").  
* **Controller (Logic Layer):** Implemented via **Server Components and API Routes**. These handle authentication, data validation, and the orchestration of database updates.

## **3\. Class Structure & Data Models**

The system is built around three core classes that encapsulate the application's data.

### **3.1 Parent**

Represents the administrative user who manages the family unit.

* **Attributes:**  
  * `id`: Unique Identifier (Primary Key).  
  * `email`: Used for authentication and notifications.  
* **Responsibilities:** creating chores, reviewing submissions, managing child accounts.

### **3.2 Child**

Represents the end-user performing tasks and earning rewards.

* **Attributes:**  
  * `id`: Unique Identifier.  
  * `name`: Display name.  
  * `parent`: Foreign Key linking to the Parent.  
  * `current_rewards`: The accessible balance.  
  * `lifetime_rewards`: Total historical earnings (for tracking progress).  
  * `access_key`: Unique key used for initial account linking.  
* **Responsibilities:** viewing available tasks, marking tasks as complete, tracking balance.

### **3.3 Chore**

Represents a distinct task with a monetary value.

* **Attributes:**  
  * `id`: Unique Identifier.  
  * `title`: Short name of the task (e.g., "Clean Room").  
  * `description`: Detailed instructions.  
  * `reward`: Monetary value (Float/Decimal).  
  * `assigned_child`: Foreign Key linking to a specific Child.  
  * `parent`: Foreign Key linking to the creator.  
  * `status`: State enum (`assigned`, `pending_approval`, `rejected`, or `complete`).

## **4\. Key Interactions and Workflows**

### **4.1 Account Linking (Parent-Child 1:M)**

To simplify the database, the system uses a **foreign keys** as the linking mechanism:

1. Parent registers and creates a child  
2. Child object is created with generated unique `id` and `access_key` for dashboard URL.  
3. Creation also links the `Child` entity to the `Parent` entity in the database.

### **4.2 The Chore Lifecycle**

1. **Creation:** Parent creates a `Chore` object with a `reward` value.  
2. **Assignment:** Chore is assigned at creation to a specific `Child`.  
3. **Submission:** Child marks the chore as "Complete" in the View. Status updates to `pending_approval`.  
4. **Approval:** Parent receives a notification. Upon clicking "Approve":  
   * Chore status updates to `complete`.  
   * `children.current_rewards` is incremented by `chores.reward`.

## **5\. Design Decisions & Principles**

### **5.1 Object-Oriented Principles**

* **Encapsulation:** We isolate the `Parent`, `Child`, and `Chore` models to protect internal data. For example, a Child cannot modify the `reward` value of a chore; only the Parent (via the Controller) has this permission.  
* **Abstraction:** Complex backend operations (database queries, balance calculations) are abstracted into simple UI actions. A single button press handles the multi-step transaction of updating chore status and transferring funds.

### **5.2 Security & Data Integrity**

* **Separation of Concerns:** By adhering to MVC, we ensure that UI components do not have direct, unchecked access to the database, preventing unauthorized manipulation of balances.  
* **Validation:** Input validation is implemented during class object creation to prevent errors or empty data fields.

## **6\. Future Roadmap**

The following features are planned for future iterations:

* **Recurring Chores:** Functionality to schedule chores that reset daily or weekly.  
* **Notifications:** Push or email alerts for "New Chore Assigned" or "Chore Approved".  
* **Gamification:** Badges or milestones based on `lifetime_rewards`.  
* **Child Removal:** Enhanced management for parents to unlink accounts.

