"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).json({ msg: err.message || "Server Error" });
};
exports.default = errorHandler;
