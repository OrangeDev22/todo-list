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
exports.updateBoards = exports.patchBoard = exports.deleteBoard = exports.createBoard = exports.getBoards = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const utils_1 = require("./utils");
const getBoards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        const { include_tasks } = req.query;
        const includeTasks = include_tasks === "true";
        const boards = yield prismaClient_1.default.board.findMany({
            where: { userId },
            orderBy: { order: "asc" },
            include: { tasks: includeTasks ? { orderBy: { order: "asc" } } : false },
        });
        res.status(201).json({
            success: true,
            boards: boards.map(({ id, name, tasks, order }) => ({
                id,
                name,
                tasks,
                order,
            })),
        });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.getBoards = getBoards;
const createBoard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, order } = req.body;
        const { id: userId } = req.user;
        if (!name)
            return res
                .status(404)
                .json({ success: false, msg: "Name can't be empty" });
        const newBoard = yield prismaClient_1.default.board.create({
            data: { name, userId, order },
            include: { tasks: true },
        });
        res.status(201).json({ success: true, record: newBoard });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.createBoard = createBoard;
const deleteBoard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;
        if (!id) {
            return res
                .status(404)
                .json({ success: false, msg: "Error: please provide a board id" });
        }
        const boardExists = yield (0, utils_1.findBoard)(userId, +id, res);
        if (!boardExists) {
            return res.status(404).json({
                success: false,
                msg: `can't find board by id ${id}`,
            });
        }
        const deleteBoard = yield prismaClient_1.default.board.delete({
            where: { id: parseInt(id) },
        });
        res.status(201).json({ success: true, record: deleteBoard });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.deleteBoard = deleteBoard;
const patchBoard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const { id: userId } = req.user;
        if (!id) {
            return res
                .status(404)
                .json({ success: false, msg: "Error: please provide a board id" });
        }
        const boardExists = yield (0, utils_1.findBoard)(userId, +id, res);
        if (!boardExists) {
            return res.status(404).json({
                success: false,
                msg: `can't find board by id ${id}`,
            });
        }
        if (!name)
            return res
                .status(404)
                .json({ success: false, msg: "Name can't be empty" });
        const newBoard = yield prismaClient_1.default.board.update({
            where: { id: parseInt(id), AND: { userId } },
            data: { name },
        });
        res.status(201).json({ success: true, record: newBoard });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.patchBoard = patchBoard;
const updateBoards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boards } = req.body;
        const updates = boards.map((board) => {
            return prismaClient_1.default.board.update({
                where: { id: board.id },
                data: Object.assign({}, board),
            });
        });
        const updatedBoards = yield Promise.all(updates);
        res.status(201).json({ success: true, record: Object.assign({}, updatedBoards) });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.updateBoards = updateBoards;
