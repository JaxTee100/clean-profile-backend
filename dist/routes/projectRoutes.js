"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = __importDefault(require("../controllers/projectController"));
const router = express_1.default.Router();
router.post('/', projectController_1.default.create);
router.get('/', projectController_1.default.getAll);
router.get('/:id', projectController_1.default.getById);
router.put('/:id', projectController_1.default.update);
router.delete('/:id', projectController_1.default.delete);
exports.default = router;
