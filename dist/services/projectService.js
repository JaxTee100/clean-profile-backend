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
const redisClient_1 = __importDefault(require("../config/redisClient"));
const projectDao_1 = __importDefault(require("../db/dao/projectDao"));
const CustomErrors_1 = require("../utils/CustomErrors");
const ProjectService = {
    createProject(projectData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { project_name, category, description, technologies, link } = projectData;
            const project = yield projectDao_1.default.create(project_name, category, description, technologies, link);
            if (!project) {
                throw new CustomErrors_1.ServiceError("Project creation failed");
            }
            yield redisClient_1.default.del("projects:all");
            return project;
        });
    },
    getAllProjects(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (limit <= 0 || offset < 0) {
                throw new CustomErrors_1.ServiceError("Invalid pagination parameters");
            }
            const cacheKey = `projects:${limit}:${offset}`;
            // 1. Try cache
            const cached = yield redisClient_1.default.get(cacheKey);
            if (cached) {
                console.log("⚡ Projects served from Redis cache");
                return JSON.parse(cached);
            }
            const [projects, total] = yield Promise.all([
                projectDao_1.default.findAll(limit, offset),
                projectDao_1.default.getTotal()
            ]);
            yield redisClient_1.default.set(cacheKey, JSON.stringify(projects), "EX", 60);
            if (!projects || projects.length === 0) {
                throw new CustomErrors_1.ResourceNotFoundError("No projects found");
            }
            const currentPage = Math.floor(offset / limit) + 1;
            const totalPages = Math.ceil(total / limit);
            return {
                projects,
                total,
                currentPage,
                totalPages
            };
        });
    },
    getAllProjectsForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield projectDao_1.default.findAllForAdmin();
            if (!projects || projects.length === 0) {
                throw new CustomErrors_1.ResourceNotFoundError("No projects found for admin");
            }
            return projects;
        });
    },
    getProjectById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `project:${id}`;
            const cached = yield redisClient_1.default.get(cacheKey);
            if (cached) {
                console.log("⚡ Project served from Redis cache");
                return JSON.parse(cached);
            }
            const project = yield projectDao_1.default.findById(id);
            if (!project) {
                throw new CustomErrors_1.ResourceNotFoundError(`Project  not found`);
            }
            yield redisClient_1.default.set(cacheKey, JSON.stringify(project), "EX", 60);
            return project;
        });
    },
    updateProject(id, projectData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield projectDao_1.default.findById(id);
            if (!existing) {
                throw new CustomErrors_1.ResourceNotFoundError(`Project  not found`);
            }
            console.log('existing', existing);
            const { project_name, category, description, technologies, link } = projectData;
            const update = {
                project_name: project_name !== null && project_name !== void 0 ? project_name : existing.project_name,
                category: category !== null && category !== void 0 ? category : existing.category,
                description: description !== null && description !== void 0 ? description : existing.description,
                technologies: technologies !== null && technologies !== void 0 ? technologies : [technologies, ...existing.technologies],
                link: link !== null && link !== void 0 ? link : existing.link,
                id
            };
            const updatedProject = yield projectDao_1.default.update(id, update.project_name, update.category, update.description, update.technologies, update.link);
            if (!updatedProject || updatedProject.length === 0) {
                throw new CustomErrors_1.ServiceError("Project update failed");
            }
            return updatedProject;
        });
    },
    removeProject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield projectDao_1.default.findById(id);
            if (!existing) {
                throw new CustomErrors_1.ResourceNotFoundError(`Project  not found`);
            }
            const deletedProject = yield projectDao_1.default.delete(id);
            if (!deletedProject || deletedProject.length === 0) {
                throw new CustomErrors_1.ServiceError("Project deletion failed");
            }
            return { message: "Project deleted successfully" };
        });
    }
};
exports.default = ProjectService;
