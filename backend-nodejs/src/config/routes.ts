import auth from "../routes/auth";
import boards from "../routes/boards";
import tasks from "../routes/tasks";
import verifyTokenMiddleware from "../middleware/verifyToken";

// Array of route configurations
const routes = [
  { path: "/api/auth", handler: auth },
  { path: "/api/boards", handler: boards, middleware: verifyTokenMiddleware },
  { path: "/api/tasks", handler: tasks, middleware: verifyTokenMiddleware },
];

export default routes;
