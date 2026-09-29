# React Concepts in Daymark

This project is intentionally small enough to read, but each concept appears in a real feature rather than in an isolated example.

## useState

**Ye hai kya:** A React Hook that stores component state and asks React to render again when that state changes.
**Is project mein kaha use kiya:** `src/pages/TasksPage.jsx` stores tasks, filters, search text, sorting, pagination, and modal state. `src/pages/AuthPage.jsx` stores controlled login/signup fields and loading feedback.
**Kab use karna chahiye (general rule):** Use it for values that affect what the user sees or can change through the UI.
**Interview mein kaise bolna hai:** “I use `useState` for the task list and active filters in `TasksPage`. When a task changes, React re-renders the counts and visible rows from the updated state.”
**Common mistake jo log karte hain:** Mutating an array or object in place. Create a new value, for example `setTasks(current => current.map(...))`, so React can observe the update.

## useEffect

**Ye hai kya:** A Hook for synchronizing a component with something outside React, such as a network request or browser event.
**Is project mein kaha use kiya:** `src/pages/TasksPage.jsx` fetches the requested task page when its query dependencies change; `src/contexts/AuthContext.jsx` checks a saved token with `/auth/me` on startup and listens for expired sessions.
**Kab use karna chahiye (general rule):** Use it for external synchronization, not to calculate values that can be derived while rendering.
**Interview mein kaise bolna hai:** “The task fetch effect depends on page, status, search, and sort values, so changing one requests the corresponding slice. Its cleanup ignores stale responses after the query changes.”
**Common mistake jo log karte hain:** Omitting reactive dependencies or using an effect for derived state, which can leave stale values or create loops.

## useContext and Context API

**Ye hai kya:** Context makes a value available to descendants without passing it through every intermediate component as props.
**Is project mein kaha use kiya:** `src/contexts/AuthContext.jsx` shares `user`, `token`, session status, and auth actions with the route guard, auth pages, and dashboard; `src/hooks/useAuth.js` reads that context.
**Kab use karna chahiye (general rule):** Use it for values needed across a broad part of the component tree; keep local form and page state local.
**Interview mein kaise bolna hai:** “The auth provider exposes the signed-in user and token, so the protected route and dashboard can read the same session without prop drilling.”
**Common mistake jo log karte hain:** Putting every piece of app state in context. That broadens updates and makes ownership harder to understand.

## useRef

**Ye hai kya:** A Hook that retains a mutable value between renders without causing a render when the value changes.
**Is project mein kaha use kiya:** `src/components/TaskModal.jsx` focuses the title field when opened and reads the native due-date input through a ref.
**Kab use karna chahiye (general rule):** Use refs for DOM access or values that should persist but do not themselves drive rendered output.
**Interview mein kaise bolna hai:** “I use a ref to focus the task title when the modal mounts. The due date is also an uncontrolled native input, so I read it from its DOM ref on submit.”
**Common mistake jo log karte hain:** Storing display state in a ref. Ref changes do not trigger rendering; use state when the screen must update.

## useMemo

**Ye hai kya:** A Hook that caches a computed value until one of its dependencies changes.
**Is project mein kaha use kiya:** `src/pages/TasksPage.jsx` memoizes the demo-mode search, status filter, sort, and page source list.
**Kab use karna chahiye (general rule):** Use it when a computation is meaningfully expensive or stable identity matters; measure before adding it everywhere.
**Interview mein kaise bolna hai:** “The demo task list is filtered and sorted from several inputs. `useMemo` recalculates that derived list only when tasks, search, filter, or sort changes.”
**Common mistake jo log karte hain:** Treating memoization as a correctness guarantee or omitting dependencies. It is a performance optimization, not state storage.

## useCallback

**Ye hai kya:** A Hook that preserves a function identity until its dependencies change.
**Is project mein kaha use kiya:** `src/pages/TasksPage.jsx` stabilizes edit, toggle, delete, and save handlers passed to task rows; `src/hooks/useApi.js` keeps its request runner stable for effects.
**Kab use karna chahiye (general rule):** Use it when stable function identity avoids meaningful child renders or makes effect dependencies predictable.
**Interview mein kaise bolna hai:** “Task rows are memoized, so I pass stable row handlers from the page with `useCallback`; unchanged row props can then skip a render.”
**Common mistake jo log karte hain:** Wrapping every function in `useCallback` or using an empty dependency list when the function captures changing values.

## React.memo

**Ye hai kya:** A component wrapper that skips rendering when its props are shallowly equal to the previous render.
**Is project mein kaha use kiya:** `src/components/TaskCard.jsx` wraps each task row with `memo`, paired with stable callbacks from `src/pages/TasksPage.jsx`.
**Kab use karna chahiye (general rule):** Use it for frequently re-rendered children when unchanged props are common and the render cost warrants it.
**Interview mein kaise bolna hai:** “A parent may re-render while a task stays the same. `React.memo` skips that row when its task object and callbacks remain unchanged.”
**Common mistake jo log karte hain:** Expecting `memo` to prevent renders when object/function props are recreated, or adding it without a measured reason.

## Custom Hooks

**Ye hai kya:** A JavaScript function whose name starts with `use` and that reuses Hook-based logic across components.
**Is project mein kaha use kiya:** `src/hooks/useApi.js` centralizes request loading and error state; `useAuth` in `src/contexts/AuthContext.jsx` provides a checked auth-context accessor.
**Kab use karna chahiye (general rule):** Extract repeated stateful behavior with a clear purpose, while keeping each hook focused.
**Interview mein kaise bolna hai:** “`useApi` packages loading, error, and request execution into reusable logic, so the auth page and task page handle API calls consistently.”
**Common mistake jo log karte hain:** Assuming a custom hook shares one state instance. Each call has its own state unless it reads shared context or another shared store.

## React Router: public, protected, and nested routes

**Ye hai kya:** Client-side routing maps URLs to components and lets route layouts be reused.
**Is project mein kaha use kiya:** `src/App.jsx` defines public `/login` and `/signup`, protects `/app`, and nests task and insights screens under `DashboardLayout`.
**Kab use karna chahiye (general rule):** Use routes for navigable views, and group pages under a shared layout when they need common navigation or access rules.
**Interview mein kaise bolna hai:** “The `/app` route is nested under a session guard, and its child routes render inside one dashboard layout using `Outlet`.”
**Common mistake jo log karte hain:** Protecting only a navigation link instead of the route itself, or forgetting a fallback for unknown URLs.

## Controlled and uncontrolled components

**Ye hai kya:** A controlled input gets its value from React state; an uncontrolled input keeps its current value in the DOM.
**Is project mein kaha use kiya:** `src/pages/AuthPage.jsx` and most fields in `src/components/TaskModal.jsx` are controlled. The due date in `TaskModal` uses `defaultValue` and a ref as an uncontrolled example.
**Kab use karna chahiye (general rule):** Use controlled inputs when the UI needs live validation or dependent behavior; use uncontrolled inputs for simple forms where reading the value on submit is enough.
**Interview mein kaise bolna hai:** “The task title is controlled so React owns its current value, while the due date is intentionally uncontrolled and read from a ref on submit.”
**Common mistake jo log karte hain:** Supplying `value` without `onChange`, or switching the same input between controlled and uncontrolled during its lifetime.

## Conditional rendering

**Ye hai kya:** Rendering different elements based on current props or state.
**Is project mein kaha use kiya:** `src/pages/TasksPage.jsx` renders loading, API errors, demo mode, empty results, and the task modal conditionally; `src/App.jsx` gates protected routes on auth state.
**Kab use karna chahiye (general rule):** Use conditions to represent real UI states explicitly, including loading, empty, and failure states.
**Interview mein kaise bolna hai:** “The task list has distinct loading and empty states, so users can tell whether data is still arriving or there are no matching tasks.”
**Common mistake jo log karte hain:** Rendering only the success case and leaving a blank screen during loading or errors.

## Lists and keys

**Ye hai kya:** React renders arrays of elements, and each sibling needs a stable key so React can track identity across updates.
**Is project mein kaha use kiya:** `src/pages/TasksPage.jsx` maps visible tasks to `TaskCard` and uses each MongoDB `_id` as its key.
**Kab use karna chahiye (general rule):** Give each repeated sibling a stable identifier from the data; avoid array positions when items can be reordered, inserted, or removed.
**Interview mein kaise bolna hai:** “Task cards use `_id` as their key, which keeps React's reconciliation aligned with the same database task when sorting or deleting.”
**Common mistake jo log karte hain:** Using an array index as key for mutable lists, which can make component state appear on the wrong row.

## Lifting state up

**Ye hai kya:** Moving shared state to the nearest common parent of components that need to read or update it.
**Is project mein kaha use kiya:** `src/pages/TasksPage.jsx` owns the task list, filters, and selected modal task; `TaskCard` and `TaskModal` receive the relevant values and handlers as props.
**Kab use karna chahiye (general rule):** Lift state only as high as needed when sibling components must stay in sync.
**Interview mein kaise bolna hai:** “The page owns both the task list and active edit target, so saving from the modal updates the same list displayed by the sibling task rows.”
**Common mistake jo log karte hain:** Duplicating shared state in siblings or lifting all state to the application root without need.

## Error Boundaries

**Ye hai kya:** A class component boundary that catches descendant render and lifecycle errors and displays a fallback UI.
**Is project mein kaha use kiya:** `src/components/ErrorBoundary.jsx` wraps the app from `src/App.jsx` and offers a reload screen if a render crashes.
**Kab use karna chahiye (general rule):** Place boundaries around meaningful UI regions where a fallback is better than losing the whole screen.
**Interview mein kaise bolna hai:** “The app-level boundary catches render-time failures in route content and shows a recovery screen; it does not replace normal API error handling.”
**Common mistake jo log karte hain:** Expecting boundaries to catch event-handler errors, async request rejections, or errors thrown by the boundary itself.

## Axios interceptors

**Ye hai kya:** Axios middleware that can modify requests or responses centrally before component-level handlers receive them.
**Is project mein kaha use kiya:** `src/lib/api.js` adds `Authorization: Bearer <token>` to requests and dispatches a session-expired event on HTTP 401 responses.
**Kab use karna chahiye (general rule):** Use interceptors for cross-cutting API behavior such as shared headers, logging, or consistent auth expiry handling.
**Interview mein kaise bolna hai:** “The request interceptor attaches the stored JWT to protected calls, and the response interceptor broadcasts 401 so the auth provider clears the session.”
**Common mistake jo log karte hain:** Registering duplicate interceptors on every render, swallowing rejected promises, or assuming the client-side guard secures the backend.
