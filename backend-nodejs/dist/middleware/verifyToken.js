"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const verifyTokenMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        res.status(403).json({ msg: "No token provided" });
        return;
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ msg: "Invalid or expired access token" });
            return;
        }
        req.user = decoded;
        next();
    });
};
exports.default = verifyTokenMiddleware;
