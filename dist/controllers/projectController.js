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
const projectDto_1 = require("../db/dto/projectDto");
const projectService_1 = __importDefault(require("../services/projectService"));
const CustomErrors_1 = require("../utils/CustomErrors");
const SuccessResponse_1 = __importDefault(require("../utils/SuccessResponse"));
const ValidateDto_1 = require("../utils/ValidateDto");
const ErrorResponse_1 = __importDefault(require("../utils/ErrorResponse"));
const ProjectController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = yield (0, ValidateDto_1.validateDto)(projectDto_1.CreateProjectDto, req.body);
                console.log('dto', dto);
                if (!dto) {
                    throw new CustomErrors_1.ServiceError("Invalid project data");
                }
                const project = yield projectService_1.default.createProject(dto);
                const response = new SuccessResponse_1.default();
                response.addDataValues(project);
                res.status(201).json(response);
            }
            catch (err) {
                console.log('Error creating project:', err);
                throw err;
            }
        });
    },
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit, 10) || 10;
                const offset = parseInt(req.query.offset, 10) || 0;
                const projects = yield projectService_1.default.getAllProjects(limit, offset);
                const response = new SuccessResponse_1.default('Projects retrieved successfully');
                response.addDataValues(projects);
                res.status(200).json(response);
            }
            catch (err) {
                throw new ErrorResponse_1.default('Failed to fetch projects');
            }
        });
    },
    getAllForAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projects = yield projectService_1.default.getAllProjectsForAdmin();
                const response = new SuccessResponse_1.default('Admin projects retrieved successfully');
                response.addDataValues(projects);
                return res.status(200).json(response);
            }
            catch (err) {
                throw new ErrorResponse_1.default('Failed to fetch admin projects');
            }
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                if (!id) {
                    console.log('invalid id or failed to fetch id');
                }
                const project = yield projectService_1.default.getProjectById(id);
                console.log('Project retrieved:', project);
                const response = new SuccessResponse_1.default('Project retrieved successfully');
                response.addDataValues(project);
                res.status(200).json(response);
            }
            catch (err) {
                throw err;
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                const dto = yield (0, ValidateDto_1.validateDto)(projectDto_1.UpdateProjectDto, req.body);
                const updatedProject = yield projectService_1.default.updateProject(id, dto);
                console.log('Project updated:', updatedProject);
                const response = new SuccessResponse_1.default('Project updated successfully');
                response.addDataValues(updatedProject);
                res.status(200).json(response);
            }
            catch (err) {
                throw err;
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                if (isNaN(id)) {
                    throw new CustomErrors_1.ServiceError("Invalid project ID");
                }
                const deletedProject = yield projectService_1.default.removeProject(id);
                console.log('Project deleted:', deletedProject);
                const response = new SuccessResponse_1.default('Project deleted successfully');
                response.addDataValues(deletedProject);
                res.status(200).json(response);
            }
            catch (err) {
                throw err;
            }
        });
    }
};
exports.default = ProjectController;
