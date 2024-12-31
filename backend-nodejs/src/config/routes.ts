import auth from "../routes/auth";
import boards from "../routes/boards";
import tasks from "../routes/tasks";
import user from "../routes/users";
import verifyTokenMiddleware from "../middleware/verifyToken";

// Array of route configurations
const routes = [
  { path: "/api/auth", handler: auth },
  { path: "/api/boards", handler: boards, middleware: verifyTokenMiddleware },
  { path: "/api/tasks", handler: tasks, middleware: verifyTokenMiddleware },
  { path: "/api/users", handler: user, middleware: verifyTokenMiddleware },
];

export default routes;
