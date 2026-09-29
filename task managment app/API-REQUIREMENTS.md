# API Requirements

This is the frontend/backend contract for the separate Express + MongoDB backend. The frontend Axios base URL is `http://localhost:5000/api` by default and can be changed with `VITE_API_URL`. All routes below are relative to that base URL.

## Shared data shapes

Task fields use these exact names and values:

```json
{
  "_id": "66f1a5d26a1f3a8c77d01001",
  "title": "Map the onboarding flow",
  "description": "Sketch the first-run experience.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-09-30T16:00:00.000Z",
  "createdAt": "2026-09-24T09:00:00.000Z",
  "updatedAt": "2026-09-24T09:00:00.000Z"
}
```

`status` is `pending` or `completed`. `priority` is `low`, `medium`, or `high`. Dates are ISO 8601 strings. User shape is `{ "_id": "...", "name": "Alex Morgan", "email": "alex@example.com" }`. Error responses use `{ "message": "Human-readable explanation" }`.

## User Signup

- **Method:** POST
- **Endpoint:** `/auth/signup`
- **Kaha se call hota hai:** `src/pages/AuthPage.jsx` when the page is in signup mode.
- **Request Body bhejna hai:** `{ "name": "Alex Morgan", "email": "alex@example.com", "password": "secret123" }`
- **Query Params (agar hai):** None.
- **Headers chahiye:** `Content-Type: application/json`; no Authorization header.
- **Expected Response (success):** HTTP 201, `{ "user": { "_id": "66f1a5d26a1f3a8c77d01002", "name": "Alex Morgan", "email": "alex@example.com" }, "token": "jwt-access-token" }`.
- **Expected Response (error case):** HTTP 400 for invalid fields or an existing email, `{ "message": "Email is already registered" }`; HTTP 500 `{ "message": "Unable to create account" }`.

## User Login

- **Method:** POST
- **Endpoint:** `/auth/login`
- **Kaha se call hota hai:** `src/pages/AuthPage.jsx` when the page is in login mode.
- **Request Body bhejna hai:** `{ "email": "alex@example.com", "password": "secret123" }`
- **Query Params (agar hai):** None.
- **Headers chahiye:** `Content-Type: application/json`; no Authorization header.
- **Expected Response (success):** HTTP 200, `{ "user": { "_id": "66f1a5d26a1f3a8c77d01002", "name": "Alex Morgan", "email": "alex@example.com" }, "token": "jwt-access-token" }`.
- **Expected Response (error case):** HTTP 401 `{ "message": "Invalid email or password" }`; HTTP 400 `{ "message": "Email and password are required" }`.

## Get Current User

- **Method:** GET
- **Endpoint:** `/auth/me`
- **Kaha se call hota hai:** `src/contexts/AuthContext.jsx` when the app starts with a saved token.
- **Request Body bhejna hai:** None.
- **Query Params (agar hai):** None.
- **Headers chahiye:** `Authorization: Bearer <token>`.
- **Expected Response (success):** HTTP 200, `{ "user": { "_id": "66f1a5d26a1f3a8c77d01002", "name": "Alex Morgan", "email": "alex@example.com" } }`.
- **Expected Response (error case):** HTTP 401 `{ "message": "Token is invalid or expired" }`.

## List, Filter, Search, Sort, and Paginate Tasks

- **Method:** GET
- **Endpoint:** `/tasks`
- **Kaha se call hota hai:** `src/pages/TasksPage.jsx` on mount and whenever page, status filter, title search, sort field, or sort order changes.
- **Request Body bhejna hai:** None.
- **Query Params (agar hai):** `page` (1-based integer), `limit` (frontend sends 6), optional `status` (`pending` or `completed`; omitted for all), optional `search` (case-insensitive title match), `sortBy` (`dueDate` or `priority`), and `sortOrder` (`asc` or `desc`). Example: `?page=1&limit=6&status=pending&search=launch&sortBy=dueDate&sortOrder=asc`.
- **Headers chahiye:** `Authorization: Bearer <token>`.
- **Expected Response (success):** HTTP 200, `{ "tasks": [<Task>], "pagination": { "page": 1, "limit": 6, "totalTasks": 12, "totalPages": 2 } }`. Each task must use the shared Task shape above. `tasks` contains only the requested page after applying filters and sorting.
- **Expected Response (error case):** HTTP 400 `{ "message": "Invalid page or sort parameters" }`; HTTP 401 `{ "message": "Token is invalid or expired" }`.

## Create Task

- **Method:** POST
- **Endpoint:** `/tasks`
- **Kaha se call hota hai:** `src/pages/TasksPage.jsx` when `src/components/TaskModal.jsx` submits a new task.
- **Request Body bhejna hai:** `{ "title": "Map the onboarding flow", "description": "Sketch the first-run experience.", "status": "pending", "priority": "high", "dueDate": "2026-09-30T16:00:00.000Z" }`.
- **Query Params (agar hai):** None.
- **Headers chahiye:** `Authorization: Bearer <token>`, `Content-Type: application/json`.
- **Expected Response (success):** HTTP 201, `{ "task": <Task> }` with `_id`, `createdAt`, and `updatedAt` included.
- **Expected Response (error case):** HTTP 400 `{ "message": "Title, status, priority, and due date are required" }`; HTTP 401 `{ "message": "Token is invalid or expired" }`.

## Update Task

- **Method:** PUT
- **Endpoint:** `/tasks/:id`
- **Kaha se call hota hai:** `src/pages/TasksPage.jsx` when the modal submits edits for an existing task.
- **Request Body bhejna hai:** `{ "title": "Map the onboarding flow", "description": "Sketch the first-run experience.", "status": "pending", "priority": "high", "dueDate": "2026-09-30T16:00:00.000Z" }` (all editable fields are sent).
- **Query Params (agar hai):** None.
- **Headers chahiye:** `Authorization: Bearer <token>`, `Content-Type: application/json`.
- **Expected Response (success):** HTTP 200, `{ "task": <Task> }` with the same `_id` and refreshed `updatedAt`.
- **Expected Response (error case):** HTTP 400 `{ "message": "Invalid task fields" }`; HTTP 401 `{ "message": "Token is invalid or expired" }`; HTTP 404 `{ "message": "Task not found" }`.

## Change Task Status

- **Method:** PATCH
- **Endpoint:** `/tasks/:id/status`
- **Kaha se call hota hai:** `src/pages/TasksPage.jsx` when a task row's completion control is clicked.
- **Request Body bhejna hai:** `{ "status": "completed" }` or `{ "status": "pending" }`.
- **Query Params (agar hai):** None.
- **Headers chahiye:** `Authorization: Bearer <token>`, `Content-Type: application/json`.
- **Expected Response (success):** HTTP 200, `{ "task": <Task> }` with updated `status` and `updatedAt`.
- **Expected Response (error case):** HTTP 400 `{ "message": "Status must be pending or completed" }`; HTTP 401 `{ "message": "Token is invalid or expired" }`; HTTP 404 `{ "message": "Task not found" }`.

## Delete Task

- **Method:** DELETE
- **Endpoint:** `/tasks/:id`
- **Kaha se call hota hai:** `src/pages/TasksPage.jsx` after the user confirms deletion from a task row's action menu.
- **Request Body bhejna hai:** None.
- **Query Params (agar hai):** None.
- **Headers chahiye:** `Authorization: Bearer <token>`.
- **Expected Response (success):** HTTP 200, `{ "message": "Task deleted", "taskId": "66f1a5d26a1f3a8c77d01001" }`.
- **Expected Response (error case):** HTTP 401 `{ "message": "Token is invalid or expired" }`; HTTP 404 `{ "message": "Task not found" }`.

## Backend notes

- Scope every task query and mutation to the authenticated user's ID; clients must not be able to access another user's tasks by changing `:id`.
- `priority` sorting should use the order `high`, `medium`, `low`, not alphabetical order, to match the frontend's demo sort.
- The frontend uses local demo data only when the network request fails before an HTTP response. HTTP validation/auth errors are shown and are not silently treated as successful demo mutations.
- Logout is client-side token removal. There is no logout API request in this contract.
