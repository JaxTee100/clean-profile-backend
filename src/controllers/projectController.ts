import { Request, Response } from "express";
import { ServiceError } from "../utils/CustomErrors";
import SuccessResponse from "../utils/SuccessResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ErrorResponse from "../utils/ErrorResponse";
import { validateCreateProject, validateUpdateProject } from "../utils/validation";
import { logger } from "../utils/logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ProjectController = {

    async create(req: Request, res: Response) {
        logger.info('Creating a new project with data:', req.body);

        try {

            const { error } = validateCreateProject(req.body);
            if (error) {
                logger.error('Validation error:', { error: error.details[0].message });
                res.status(400).json({
                    success: false,
                    message: `Validation error: ${error.details[0].message}`
                }
                );
                return;
            }
            let { project_name, category, description, technologies, link } = req.body;
            if (typeof technologies === "string") {
                technologies = technologies.split(",").map((t: string) => t.trim());
            }
            const newProject = await prisma.project.create({
                data: { project_name, category, description, technologies, link }
            })
            logger.info('Project created successfully:', newProject.id);
            const response = new SuccessResponse('Project created successfully');
            response.addDataValues(newProject);
            res.status(201).json(response);



        } catch (err) {
            logger.error('Error creating project:', err);
            throw new ErrorResponse('Failed to create project');
        }
    },

    async getAll(req: Request, res: Response) {
    try {
        logger.info("Fetching all projects", { query: req.query });

        const limit = parseInt(req.query.limit as string, 10) || 10;
        const page = parseInt(req.query.page as string, 10) || 1;
        const offset = (page - 1) * limit;

        // Fetch total count and projects in parallel
        const [total, projects] = await Promise.all([
            prisma.project.count(),
            prisma.project.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        if (projects.length === 0) {
            logger.warn("No projects found");
            return res.status(404).json({
                success: false,
                message: "No projects found",
            });
        }

        const totalPages = Math.ceil(total / limit);

        logger.info(`Fetched ${projects.length} projects (Page ${page}/${totalPages})`);

        const response = new SuccessResponse("Projects retrieved successfully");
        response.addDataValues({
            projects,
            total,
            currentPage: page,
            totalPages,
        });

        return res.status(200).json(response);
    } catch (err) {
        logger.error("Error fetching projects", { error: err });
        return res.status(500).json(new ErrorResponse("Failed to fetch projects"));
    }
},



    async getById(req: Request, res: Response) {
        logger.info('Fetching project with ID:', req.params.id);
        try {
            const id = parseInt(req.params.id, 10);
            if (!id) {
                console.log('invalid id or failed to fetch id')
            }

            const project = await prisma.project.findUnique({
                where: { id }
            });
            if (!project) {
                logger.warn('Project not found with ID:', id);
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }

            const response = new SuccessResponse('Project retrieved successfully');
            response.addDataValues(project);
            logger.info('Project fetched successfully:', project.id);
            res.status(200).json(response);
        } catch (err) {
            throw err;
        }
    },

    async update(req: Request, res: Response) {
        logger.info('Updating project with ID:', req.params.id);
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id)) {
                throw new ServiceError("Invalid project ID");
            }

            const { error } = validateUpdateProject(req.body);
            if (error) {
                logger.error('Validation error:', { error: error.details[0].message });
                res.status(400).json({  
                    success: false,
                    message: `Validation error: ${error.details[0].message}`
                });
                return;
            }
            let { project_name, category, description, technologies, link } = req.body;
            if (technologies && typeof technologies === "string") {
                technologies = technologies.split(",").map((t: string) => t.trim());
            }   
            const updatedProject = await prisma.project.update({
                where: { id },
                data: { project_name, category, description, technologies, link }
            });
            logger.info('Project updated successfully:', updatedProject.id);

            const response = new SuccessResponse('Project updated successfully');
            response.addDataValues(updatedProject);
            res.status(200).json(response);
        } catch (err) {
            throw err;
        }
    },

    async delete(req: Request, res: Response) {
        logger.info('Deleting project with ID:', req.params.id);
        try {
            const id = parseInt(req.params.id, 10);
            const projectId = await prisma.project.findUnique({
                where: { id }
            });
            console.log('projectId', projectId);
            if(!projectId){
                res.status(400).json({
                    success: false,
                    message: "Project not found"
                });
                return;
            }
            if (isNaN(id)) {
                throw new ServiceError("Invalid project ID");
            }

            const deletedProject = await prisma.project.delete({
                where: { id }
            });
            logger.info('Project deleted successfully:', deletedProject.id);

            const response = new SuccessResponse('Project deleted successfully');
            response.addDataValues(deletedProject);
            res.status(200).json(response);
        } catch (err) {
            throw err;
        }
    }

}

export default ProjectController;