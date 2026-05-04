# PROJECT_SPEC.md

## 1. Overview

The goal of this project is to build a full-stack Team Task Manager web application that enables users to collaborate within teams, manage projects, assign tasks, and track progress.

The system enforces role-based access control (RBAC) to ensure that only authorized users can perform specific actions. The focus is on clean backend design, proper relational modeling, and a functional, user-friendly interface.

---

## 2. Roles & Permissions

### Admin (Team स्तर)
- Create and manage teams
- Add or remove team members
- Create projects within a team
- Create and assign tasks
- View all tasks within the team

### Member
- View teams they are part of
- View projects within those teams
- View tasks assigned to them
- Update the status of their own tasks

### Important Note
Role-based access control is enforced at the **team level** using the `TeamMember.role` field.

The global `User.role` (if present) is not used for authorization decisions within teams.

---

## 3. Core Entities & Relationships

### User
Represents an individual account in the system.

Fields:
- id
- name
- email (unique)
- password (hashed)

Relationships:
- Can belong to multiple teams
- Can be assigned multiple tasks

---

### Team
Represents a group of users collaborating together.

Fields:
- id
- name

Relationships:
- Has many users (via TeamMember)
- Has many projects

---

### TeamMember
Join table managing many-to-many relationship between users and teams.

Fields:
- id
- userId
- teamId
- role (ADMIN or MEMBER within that team)

Constraints:
- A user can only be added once per team

---

### Project
Represents a collection of tasks within a team.

Fields:
- id
- name
- teamId

Relationships:
- Belongs to a team
- Has many tasks

---

### Task
Represents a unit of work assigned to a user.

Fields:
- id
- title
- description (optional)
- status (TODO, IN_PROGRESS, DONE)
- priority (LOW, MEDIUM, HIGH)
- dueDate (optional)
- projectId
- assigneeId (optional)

Relationships:
- Belongs to a project
- Can be assigned to a user

---

## 4. Key Features

### Authentication
- User signup and login
- Password hashing using bcrypt
- JWT-based authentication

---

### Team Management
- Create teams
- Add members to teams
- View teams user belongs to

---

### Project Management
- Create projects under a team
- View all projects within a team

---

### Task Management
- Create tasks within a project
- Assign tasks to team members
- Update task status (TODO → IN_PROGRESS → DONE)
- Set priority and due dates

---

### Dashboard
- Overview of tasks:
  - Total tasks
  - Completed tasks
  - Overdue tasks
- “My Tasks” view for logged-in user
- Basic filtering by status or project

---

## 5. Major User Flows

### Authentication Flow
1. User signs up with name, email, and password
2. User logs in and receives a JWT token
3. Token is used for authenticated API requests

---

### Team Flow
1. Admin creates a team
2. Admin adds members to the team
3. Members can view teams they belong to

---

### Project Flow
1. Admin creates a project within a team
2. All team members can view the project

---

### Task Flow
1. Admin creates a task in a project
2. Admin assigns task to a team member
3. Member updates task status as they work on it
4. Tasks are tracked via dashboard

---

## 6. Access Control Rules (RBAC)

- Only authenticated users can access protected routes
- Users can only access teams they belong to
- Users can only access projects within their teams
- Users can only access tasks within their team’s projects

### Admin Permissions
- Create teams
- Add/remove members
- Create projects
- Assign tasks

### Member Permissions
- View projects and tasks
- Update only their assigned tasks

---

## 7. Additional Access Constraints

- A user cannot assign tasks to someone outside the team
- A user cannot create a project in a team they are not part of
- A user cannot update tasks outside their team
- Members cannot modify or delete teams or projects

---

## 8. Task Rules & Lifecycle

### Status Flow
- TODO → IN_PROGRESS → DONE
- Direct TODO → DONE is allowed
- Once DONE, task is typically not reverted (optional behavior)

### Ownership
- Only the assigned user can update task status

---

## 9. Due Date Rules

- Due date cannot be set in the past during creation
- Due date cannot be updated to a past date
- A task is considered **overdue** if:
  - dueDate < current date AND status ≠ DONE

---

## 10. Team Membership Rules

- A user cannot be added to the same team more than once
- A team must always have at least one Admin
- An Admin cannot remove themselves if they are the only Admin

### On User Removal
- User loses access to all team resources
- Tasks assigned to them remain but may become unassigned

---

## 11. Project Rules

- A project must belong to a valid team
- Only Admins can create or delete projects
- Projects are not accessible outside the team

---

## 12. Task Assignment Rules

- Tasks can only be assigned to users within the same team
- Tasks may be created without an assignee
- If an assignee leaves the team:
  - Task remains but becomes unassigned

---

## 13. Authentication Rules

- JWT must be included in all protected requests
- Missing or invalid token → 401 Unauthorized
- Valid token but insufficient permissions → 403 Forbidden

---

## 14. Validation Rules

- Email must be unique
- Required fields must not be empty
- Input values should be trimmed
- Task title must have a minimum length (e.g., 3 characters)

---

## 15. Dashboard Data Rules

- Total tasks: all tasks in user’s teams
- Completed tasks: tasks with status DONE
- Overdue tasks: tasks past due date and not DONE
- My Tasks: tasks assigned to current user

---

## 16. Tech Stack

- Frontend: Next.js
- Backend: Express.js
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT
- Deployment: Railway

---

## 17. Non-Goals (Out of Scope)

- Real-time updates (WebSockets)
- Notifications (email or push)
- File attachments
- Advanced analytics

---

## 18. Notes

This project focuses on:
- Clean API design
- Proper relational data modeling
- Strong role-based access control
- Handling of edge cases and constraints
- A fully functional deployed application