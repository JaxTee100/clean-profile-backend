"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProject = exports.validateCreateProject = void 0;
const joi_1 = __importDefault(require("joi"));
const createProjectSchema = joi_1.default.object({
    project_name: joi_1.default.string().min(3).max(100).required(),
    category: joi_1.default.string().min(3).max(50).required(),
    description: joi_1.default.string().min(10).max(500).required(),
    technologies: joi_1.default.array().items(joi_1.default.string().min(2)).min(1).required(),
    link: joi_1.default.string().uri().required(),
});
const updateProjectSchema = joi_1.default.object({
    project_name: joi_1.default.string().min(3).max(100),
    category: joi_1.default.string().min(3).max(50),
    description: joi_1.default.string().min(10).max(500),
    technologies: joi_1.default.array().items(joi_1.default.string().min(2)).min(1),
    link: joi_1.default.string().uri(),
});
const validateCreateProject = (data) => {
    return createProjectSchema.validate(data);
};
exports.validateCreateProject = validateCreateProject;
const validateUpdateProject = (data) => {
    return updateProjectSchema.validate(data);
};
exports.validateUpdateProject = validateUpdateProject;
