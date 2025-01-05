"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tasksController_1 = require("../controllers/tasksController");
const router = express_1.default.Router();
router.get("/", tasksController_1.getTasks);
router.post("/", tasksController_1.createTask);
router.patch("/", tasksController_1.updateTasks);
router.patch("/:id", tasksController_1.updateTask);
router.delete("/:id", tasksController_1.deleteTask);
exports.default = router;
