"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const boardsController_1 = require("../controllers/boardsController");
const router = express_1.default.Router();
router.get("/", boardsController_1.getBoards);
router.post("/", boardsController_1.createBoard);
router.delete("/:id", boardsController_1.deleteBoard);
router.patch("/:id", boardsController_1.patchBoard);
router.patch("/", boardsController_1.updateBoards);
exports.default = router;
