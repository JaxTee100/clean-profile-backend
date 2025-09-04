
import ProjectDAO from "../db/dao/projectDao";
import { CreateProjectDto, UpdateProjectDto } from "../db/dto/projectDto";
import { ResourceNotFoundError, ServiceError } from "../utils/CustomErrors";

const ProjectService = {
  async createProject(projectData: CreateProjectDto) {
    const { project_name, category, description, technologies, link } = projectData;

    const project = await ProjectDAO.create(
      project_name,
      category,
      description,
      technologies,
      link
    );

    if (!project) {
      throw new ServiceError("Project creation failed");
    }


    return project;
  },

  async getAllProjects(limit: number, offset: number) {
    if (limit <= 0 || offset < 0) {
      throw new ServiceError("Invalid pagination parameters");
    }



    console.log('fetching from db');

    // 2. Fetch from DB
    const [projects, total] = await Promise.all([
      ProjectDAO.findAll(limit, offset),
      ProjectDAO.getTotal(),
    ]);

    if (!projects || projects.length === 0) {
      throw new ResourceNotFoundError("No projects found");
    }
    console.log('fetched from db');


    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    console.log({ currentPage, totalPages, total });

    return {
      projects,
      total,
      currentPage,
      totalPages,
    };
  },

  async getAllProjectsForAdmin() {
    const projects = await ProjectDAO.findAllForAdmin();
    if (!projects || projects.length === 0) {
      throw new ResourceNotFoundError("No projects found for admin");
    }
    return projects;
  },

  async getProjectById(id: number) {
    const cacheKey = `project:${id}`;


    const project = await ProjectDAO.findById(id);
    if (!project) {
      throw new ResourceNotFoundError(`Project not found`);
    }


    return project;
  },

  async updateProject(id: number, projectData: UpdateProjectDto) {
    const existing = await ProjectDAO.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError(`Project not found`);
    }

    const { project_name, category, description, technologies, link } = projectData;
    const update = {
      project_name: project_name ?? existing.project_name,
      category: category ?? existing.category,
      description: description ?? existing.description,
      technologies:
        technologies ??
        [...(existing.technologies || []), ...(technologies ? [technologies] : [])],
      link: link ?? existing.link,
      id,
    };

    const updatedProject = await ProjectDAO.update(
      id,
      update.project_name,
      update.category,
      update.description,
      update.technologies,
      update.link
    );

    if (!updatedProject || updatedProject.length === 0) {
      throw new ServiceError("Project update failed");
    }



    return updatedProject;
  },

  async removeProject(id: number) {
    const existing = await ProjectDAO.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError(`Project not found`);
    }

    const deletedProject = await ProjectDAO.delete(id);
    if (!deletedProject || deletedProject.length === 0) {
      throw new ServiceError("Project deletion failed");
    }



    return { message: "Project deleted successfully" };
  },
};

export default ProjectService;
