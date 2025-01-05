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
exports.logoutController = exports.siginController = exports.signupController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const jwtUtils_1 = require("../../utils/jwtUtils");
const TOKEN_MAX_LIFE = 24 * 60 * 60 * 1000;
const signupController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        const existingUser = yield prismaClient_1.default.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });
        if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) === email) {
            return res
                .status(400)
                .json({ success: false, msg: "Email already in use" });
        }
        if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.username) === username) {
            return res
                .status(400)
                .json({ success: false, msg: "Username already in use" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create new user
        const newUser = yield prismaClient_1.default.user.create({
            data: { email, password: hashedPassword, username },
        });
        // Create default user boards
        const defaultBoards = ["To do", "Doing", "Done"];
        yield Promise.all(defaultBoards.map((title) => __awaiter(void 0, void 0, void 0, function* () {
            yield prismaClient_1.default.board.create({
                data: { userId: newUser.id, name: title },
            });
        })));
        const data = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
        };
        const accessToken = (0, jwtUtils_1.generateToken)(data);
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 24);
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: TOKEN_MAX_LIFE,
            sameSite: "strict",
        });
        res.status(201).json({
            success: true,
            userData: Object.assign({}, data),
            expirationDate: expirationDate.getTime(),
        });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.signupController = signupController;
const siginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.query;
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                msg: "please provide a valid email or password",
            });
        }
        const user = yield prismaClient_1.default.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(404).json({ success: false, msg: "Invalid email" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ success: false, msg: "Invalid password" });
        }
        const data = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 24);
        const accessToken = (0, jwtUtils_1.generateToken)(data);
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: TOKEN_MAX_LIFE,
            sameSite: "strict",
        });
        res.status(201).json({
            success: true,
            userData: Object.assign({}, data),
            expirationDate,
        });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error());
    }
});
exports.siginController = siginController;
const logoutController = (req, res, next) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            success: true,
            msg: "Logged out successfully",
        });
    }
    catch (error) {
        console.error("--error", error);
        next(new Error("Failed to log out"));
    }
};
exports.logoutController = logoutController;
