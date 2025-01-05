"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTasks = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const utils_1 = require("../boardsController/utils");
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const utils_2 = require("./utils");
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId } = req.body;
        const tasks = yield prismaClient_1.default.task.findMany({
            where: { boardId },
            orderBy: { order: "asc" },
        });
        res.status(201).json({ success: true, record: Object.assign({}, tasks) });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.getTasks = getTasks;
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId, content, order } = req.body;
        const { id: userId } = req.user;
        const boardExists = yield (0, utils_1.findBoard)(userId, +boardId, res);
        if (!boardExists) {
            return res.status(404).json({
                success: false,
                msg: `can't find board by id ${boardId}`,
            });
        }
        if (order === undefined) {
            return res.status(404).json({
                success: false,
                msg: `Order number is required`,
            });
        }
        if (!content) {
            res.status(404).json({ success: false, msg: "Content can't be empty" });
        }
        const newTask = yield prismaClient_1.default.task.create({
            data: { content, boardId, order },
        });
        res.status(201).json({ success: true, record: Object.assign({}, newTask) });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.createTask = createTask;
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId, content, newBoardId } = req.body;
        const { id } = req.params;
        const { id: userId } = req.user;
        if (!content) {
            res.status(404).json({ success: false, msg: "Content can't be empty" });
        }
        if (newBoardId) {
            const boardExists = yield (0, utils_1.findBoard)(userId, newBoardId, res);
            if (!boardExists)
                return res.status(404).json({
                    success: false,
                    msg: `can't find board by id ${newBoardId}`,
                });
        }
        const tasksExists = yield (0, utils_2.findTasks)(boardId, +id, res);
        if (!tasksExists)
            return res
                .status(404)
                .json({ success: false, msg: "Task doesn't exits" });
        const updatedTask = yield prismaClient_1.default.task.update({
            where: { id: +id, AND: { boardId } },
            data: { content, boardId: newBoardId !== null && newBoardId !== void 0 ? newBoardId : boardId },
        });
        res.status(201).json({ success: true, record: Object.assign({}, updatedTask) });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId } = req.body;
        const { id } = req.params;
        const tasksExists = yield (0, utils_2.findTasks)(boardId, +id, res);
        if (!tasksExists)
            return res
                .status(404)
                .json({ success: false, msg: "Task doesn't exits" });
        const deletedTask = yield prismaClient_1.default.task.delete({
            where: { id: +id, AND: { boardId } },
        });
        res.status(201).json({ success: true, record: Object.assign({}, deletedTask) });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.deleteTask = deleteTask;
const updateTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tasks } = req.body;
        const updates = tasks.map((task) => {
            return prismaClient_1.default.task.update({
                where: { id: task.id },
                data: Object.assign({}, task),
            });
        });
        const updatedTasks = yield Promise.all(updates);
        res.status(201).json({ success: true, record: Object.assign({}, updatedTasks) });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.updateTasks = updateTasks;
