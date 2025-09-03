import { Request, Response } from "express";
import { CreateProjectDto, UpdateProjectDto } from "../db/dto/projectDto";
import ProjectService from "../services/projectService";
import { ServiceError } from "../utils/CustomErrors";
import SuccessResponse from "../utils/SuccessResponse";
import { validateDto } from "../utils/ValidateDto";
import ErrorResponse from "../utils/ErrorResponse";


const ProjectController = {

    async create(req: Request, res: Response) {

        try {

            const dto = await validateDto(CreateProjectDto, req.body);
            console.log('dto', dto)
            if (!dto) {
                throw new ServiceError("Invalid project data");
            }
            const project = await ProjectService.createProject(dto);

            const response = new SuccessResponse();
            response.addDataValues(project);
            res.status(201).json(response);


        } catch (err) {
            console.log('Error creating project:', err);
            throw err;
        }
    },

    async getAll(req: Request, res: Response) {
        try {
            
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const offset = parseInt(req.query.offset as string, 10) || 0;

            const projects = await ProjectService.getAllProjects(limit, offset);
          

            const response = new SuccessResponse('Projects retrieved successfully');
            
            response.addDataValues(projects);
            res.status(200).json(response);
        } catch (err) {
            throw new ErrorResponse('Failed to fetch projects');
        }
    },
    async getAllForAdmin(req: Request, res: Response){
        try {
            const projects = await ProjectService.getAllProjectsForAdmin();

            const response = new SuccessResponse('Admin projects retrieved successfully');
            response.addDataValues(projects);

            return res.status(200).json(response);
        } catch (err) {
            throw new ErrorResponse('Failed to fetch admin projects');
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            if(!id){
                console.log('invalid id or failed to fetch id')
            }

            const project = await ProjectService.getProjectById(id);
            console.log('Project retrieved:', project);

            const response = new SuccessResponse('Project retrieved successfully');
            response.addDataValues(project);
            res.status(200).json(response);
        } catch (err) {
            throw err;
        }
    },

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
           

            const dto = await validateDto(UpdateProjectDto, req.body);

            const updatedProject = await ProjectService.updateProject(id, dto);
            console.log('Project updated:', updatedProject);

            const response = new SuccessResponse('Project updated successfully');
            response.addDataValues(updatedProject);
            res.status(200).json(response);
        } catch (err) {
            throw err;
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                throw new ServiceError("Invalid project ID");
            }

            const deletedProject = await ProjectService.removeProject(id);
            console.log('Project deleted:', deletedProject);

            const response = new SuccessResponse('Project deleted successfully');
            response.addDataValues(deletedProject);
            res.status(200).json(response);
        } catch (err) {
            throw err;
        }
    }

}

export default ProjectController;