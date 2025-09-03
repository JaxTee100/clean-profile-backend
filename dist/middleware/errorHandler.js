"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ErrorResponse_1 = __importDefault(require("../utils/ErrorResponse"));
const CustomErrors_1 = require("../utils/CustomErrors");
const errorHandler = (err, req, res, next) => {
    const response = new ErrorResponse_1.default();
    if (err instanceof CustomErrors_1.ClassValidationError) {
        response.setMessage(err.message);
        response.addDataValues(err);
        return res.status(422).json(response);
    }
    if (err instanceof CustomErrors_1.ResourceNotFoundError) {
        response.setMessage(err.message);
        response.addDataValues(err);
        return res.status(404).json(response);
    }
    if (err instanceof CustomErrors_1.ResourceAlreadyExistsError) {
        response.setMessage(err.message);
        response.addDataValues(err);
        return res.status(409).json(response);
    }
    if (err instanceof CustomErrors_1.AuthorizationError || err instanceof CustomErrors_1.ForbiddenError) {
        response.setMessage(err.message);
        response.addDataValues(err);
        return res.status(403).json(response);
    }
    if (err instanceof CustomErrors_1.ServiceError) {
        response.setMessage(err.message);
        response.addDataValues(err);
        return res.status(500).json(response);
    }
    // Fallback for unexpected errors
    return res.status(500).json({
        success: false,
        message: err.message || 'An unexpected error occurred',
    });
};
exports.errorHandler = errorHandler;
