"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../routes/auth"));
const boards_1 = __importDefault(require("../routes/boards"));
const tasks_1 = __importDefault(require("../routes/tasks"));
const users_1 = __importDefault(require("../routes/users"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
// Array of route configurations
const routes = [
    { path: "/api/auth", handler: auth_1.default },
    { path: "/api/boards", handler: boards_1.default, middleware: verifyToken_1.default },
    { path: "/api/tasks", handler: tasks_1.default, middleware: verifyToken_1.default },
    { path: "/api/users", handler: users_1.default, middleware: verifyToken_1.default },
];
exports.default = routes;
