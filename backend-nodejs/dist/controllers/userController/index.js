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
exports.getUser = exports.deleteUser = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const userExists = yield prismaClient_1.default.user.findUnique({ where: { id } });
        if (!userExists)
            return res
                .status(400)
                .json({ success: false, msg: "Can't find the user" });
        const deletedUser = yield prismaClient_1.default.user.delete({
            where: { id: id },
        });
        res.status(201).json({ success: true, record: Object.assign({}, deletedUser) });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.deleteUser = deleteUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id },
            select: { email: true, username: true },
        });
        if (!user)
            return res
                .status(400)
                .json({ success: false, msg: "Can't find the user" });
        res.status(201).json({ success: true, record: user });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.getUser = getUser;
