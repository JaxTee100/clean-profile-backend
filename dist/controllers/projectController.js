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
const CustomErrors_1 = require("../utils/CustomErrors");
const SuccessResponse_1 = __importDefault(require("../utils/SuccessResponse"));
const ErrorResponse_1 = __importDefault(require("../utils/ErrorResponse"));
const validation_1 = require("../utils/validation");
const logger_1 = require("../utils/logger");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const ProjectController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info('Creating a new project with data:', req.body);
            try {
                const { error } = (0, validation_1.validateCreateProject)(req.body);
                if (error) {
                    logger_1.logger.error('Validation error:', { error: error.details[0].message });
                    res.status(400).json({
                        success: false,
                        message: `Validation error: ${error.details[0].message}`
                    });
                    return;
                }
                let { project_name, category, description, technologies, link } = req.body;
                if (typeof technologies === "string") {
                    technologies = technologies.split(",").map((t) => t.trim());
                }
                const newProject = yield prisma.project.create({
                    data: { project_name, category, description, technologies, link }
                });
                logger_1.logger.info('Project created successfully:', newProject.id);
                const response = new SuccessResponse_1.default('Project created successfully');
                response.addDataValues(newProject);
                res.status(201).json(response);
            }
            catch (err) {
                logger_1.logger.error('Error creating project:', err);
                throw new ErrorResponse_1.default('Failed to create project');
            }
        });
    },
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info("Fetching all projects for production testing", { query: req.query });
                const limit = parseInt(req.query.limit, 10) || 10;
                const page = parseInt(req.query.page, 10) || 1;
                const offset = (page - 1) * limit;
                // Fetch total count and projects in parallel
                const [total, projects] = yield Promise.all([
                    prisma.project.count(),
                    prisma.project.findMany({
                        skip: offset,
                        take: limit,
                        orderBy: { createdAt: "desc" },
                    }),
                ]);
                if (projects.length === 0) {
                    logger_1.logger.warn("No projects found");
                    return res.status(404).json({
                        success: false,
                        message: "No projects found",
                    });
                }
                const totalPages = Math.ceil(total / limit);
                logger_1.logger.info(`Fetched ${projects.length} projects (Page ${page}/${totalPages})`);
                const response = new SuccessResponse_1.default("Projects retrieved successfully");
                response.addDataValues({
                    projects,
                    total,
                    currentPage: page,
                    totalPages,
                });
                console.log("Projects response structure:", {
                    projects,
                    total,
                    page,
                    totalPages
                });
                return res.status(200).json(response);
            }
            catch (err) {
                logger_1.logger.error("Error fetching projects", { error: err });
                return res.status(500).json(new ErrorResponse_1.default("Failed to fetch projects"));
            }
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info('Fetching project with ID:', req.params.id);
            try {
                const id = parseInt(req.params.id, 10);
                if (!id) {
                    console.log('invalid id or failed to fetch id');
                }
                const project = yield prisma.project.findUnique({
                    where: { id }
                });
                if (!project) {
                    logger_1.logger.warn('Project not found with ID:', id);
                    return res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                }
                const response = new SuccessResponse_1.default('Project retrieved successfully');
                response.addDataValues(project);
                logger_1.logger.info('Project fetched successfully:', project.id);
                res.status(200).json(response);
            }
            catch (err) {
                throw err;
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info('Updating project with ID:', req.params.id);
            try {
                const id = parseInt(req.params.id, 10);
                if (isNaN(id)) {
                    throw new CustomErrors_1.ServiceError("Invalid project ID");
                }
                const { error } = (0, validation_1.validateUpdateProject)(req.body);
                if (error) {
                    logger_1.logger.error('Validation error:', { error: error.details[0].message });
                    res.status(400).json({
                        success: false,
                        message: `Validation error: ${error.details[0].message}`
                    });
                    return;
                }
                let { project_name, category, description, technologies, link } = req.body;
                if (technologies && typeof technologies === "string") {
                    technologies = technologies.split(",").map((t) => t.trim());
                }
                const updatedProject = yield prisma.project.update({
                    where: { id },
                    data: { project_name, category, description, technologies, link }
                });
                logger_1.logger.info('Project updated successfully:', updatedProject.id);
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
            logger_1.logger.info('Deleting project with ID:', req.params.id);
            try {
                const id = parseInt(req.params.id, 10);
                const projectId = yield prisma.project.findUnique({
                    where: { id }
                });
                console.log('projectId', projectId);
                if (!projectId) {
                    res.status(400).json({
                        success: false,
                        message: "Project not found"
                    });
                    return;
                }
                if (isNaN(id)) {
                    throw new CustomErrors_1.ServiceError("Invalid project ID");
                }
                const deletedProject = yield prisma.project.delete({
                    where: { id }
                });
                logger_1.logger.info('Project deleted successfully:', deletedProject.id);
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
