// user.dto.ts


import { IsNotEmpty, IsString, IsArray, IsUrl, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
  constructor(
    project_name: string,
    category: string,
    description: string,
    technologies: string[],
    link: string
  ) {
    this.project_name = project_name;
    this.category = category;
    this.description = description;
    this.technologies = technologies;
    this.link = link;
  }

  @IsNotEmpty({ message: 'Project name is required' })
  @IsString({ message: 'Project name must be a string' })
  project_name: string;

  @IsNotEmpty({ message: 'Category is required' })
  @IsString({ message: 'Category must be a string' })
  category: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsArray({ message: 'Technologies must be an array' })
  @ArrayNotEmpty({ message: 'Technologies array cannot be empty' })
  @IsString({ each: true, message: 'Each technology must be a string' })
  technologies: string[];

  @IsNotEmpty({ message: 'Link is required' })
  @IsUrl({}, { message: 'Link must be a valid URL' })
  link: string;
}




export class UpdateProjectDto {
  constructor(
    project_name: string,
    category: string,
    description: string,
    technologies: string[],
    link: string
  ) {
    this.project_name = project_name;
    this.category = category;
    this.description = description;
    this.technologies = technologies;
    this.link = link;
  }

  @IsOptional()
  @IsString({ message: 'Project name must be a string' })
  project_name?: string;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Technologies must be an array' })
  @ArrayNotEmpty({ message: 'Technologies array cannot be empty' })
  @IsString({ each: true, message: 'Each technology must be a string' })
  technologies?: string[];

  @IsOptional()
  @IsUrl({}, { message: 'Link must be a valid URL' })
  link?: string;
}



