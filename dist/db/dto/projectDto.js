"use strict";
// user.dto.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProjectDto = exports.CreateProjectDto = void 0;
const class_validator_1 = require("class-validator");
class CreateProjectDto {
    constructor(project_name, category, description, technologies, link) {
        this.project_name = project_name;
        this.category = category;
        this.description = description;
        this.technologies = technologies;
        this.link = link;
    }
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Project name is required' }),
    (0, class_validator_1.IsString)({ message: 'Project name must be a string' })
], CreateProjectDto.prototype, "project_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Category is required' }),
    (0, class_validator_1.IsString)({ message: 'Category must be a string' })
], CreateProjectDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Description is required' }),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' })
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Technologies must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Technologies array cannot be empty' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Each technology must be a string' })
], CreateProjectDto.prototype, "technologies", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Link is required' }),
    (0, class_validator_1.IsUrl)({}, { message: 'Link must be a valid URL' })
], CreateProjectDto.prototype, "link", void 0);
class UpdateProjectDto {
    constructor(project_name, category, description, technologies, link) {
        this.project_name = project_name;
        this.category = category;
        this.description = description;
        this.technologies = technologies;
        this.link = link;
    }
}
exports.UpdateProjectDto = UpdateProjectDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Project name must be a string' })
], UpdateProjectDto.prototype, "project_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Category must be a string' })
], UpdateProjectDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' })
], UpdateProjectDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Technologies must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Technologies array cannot be empty' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Each technology must be a string' })
], UpdateProjectDto.prototype, "technologies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Link must be a valid URL' })
], UpdateProjectDto.prototype, "link", void 0);
