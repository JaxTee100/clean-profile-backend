import Joi from 'joi';

interface ProjectData {
  project_name?: string;
  category?: string;
  description?: string;
  technologies?: string[];
  link?: string;
}

const createProjectSchema = Joi.object({
  project_name: Joi.string().min(3).max(100).required(),
  category: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(10).max(500).required(),
  technologies: Joi.array().items(Joi.string().min(2)).min(1).required(),
  link: Joi.string().uri().required(),
});

const updateProjectSchema = Joi.object({
  project_name: Joi.string().min(3).max(100),
  category: Joi.string().min(3).max(50),
  description: Joi.string().min(10).max(500),
  technologies: Joi.array().items(Joi.string().min(2)).min(1),
  link: Joi.string().uri(),
});

const validateCreateProject = (data: ProjectData) => {
  return createProjectSchema.validate(data);
};

const validateUpdateProject = (data: ProjectData) => {
  return updateProjectSchema.validate(data);
};

export { validateCreateProject, validateUpdateProject, ProjectData };
