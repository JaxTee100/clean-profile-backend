"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceAlreadyExistsError = exports.ClassValidationError = exports.ResourceNotFoundError = exports.ForbiddenError = exports.AuthorizationError = exports.ServiceError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(msg, errors) {
        super(msg);
        this.name = 'ValidationError';
        this.message = msg;
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
class ServiceError extends Error {
    // public readonly message:string = 'a service error was encountered';
    constructor(message = 'A service error was encountered', errors = []) {
        super(message);
        this.errors = [];
        this.name = 'ServiceError';
        this.message = message;
        this.addFieldError({ reason: message, type: 'REQUEST_FAILED' });
        this.addFieldErrors(errors);
    }
    addFieldError(error) {
        this.errors.unshift(error);
    }
    addFieldErrors(errors) {
        for (let error of errors) {
            this.addFieldError(error);
        }
    }
}
exports.ServiceError = ServiceError;
class AuthorizationError extends ServiceError {
    constructor(msg, errors = []) {
        super(msg, errors);
        this.name = 'AuthorizationError';
    }
}
exports.AuthorizationError = AuthorizationError;
class ForbiddenError extends ServiceError {
    constructor(msg, errors = []) {
        super(msg, errors);
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
class ResourceNotFoundError extends ServiceError {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'ResourceNotFoundError';
        this.addFieldError({ reason: message, type: 'RESOURCE_NOT_FOUND' });
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
class ClassValidationError extends ServiceError {
    // public readonly message:string = 'validation error';
    constructor(errors) {
        super('Validation failed for one or more fields in your request\n  You might have the wrong fields in you request');
        this.name = 'ClassValidationError';
        this.parseValidationError(errors);
    }
    parseValidationError(errors, path = '') {
        var _a;
        for (let error of errors) {
            for (let constraintsKey in error.constraints) {
                this.addFieldError({
                    value: error.value,
                    field: `${path}${error.property}`,
                    type: constraintsKey,
                    reason: error.constraints[constraintsKey],
                    children: error.children,
                });
            }
            if ((_a = error.children) === null || _a === void 0 ? void 0 : _a.length) {
                this.parseValidationError(error.children, `${path}${error.property}.`);
            }
        }
    }
}
exports.ClassValidationError = ClassValidationError;
class ResourceAlreadyExistsError extends ServiceError {
    constructor(message = 'Resource already exists') {
        super(message);
        this.name = 'ResourceAlreadyExistsError';
        this.addFieldError({ reason: message, type: 'RESOURCE_ALREADY_EXISTS' });
    }
}
exports.ResourceAlreadyExistsError = ResourceAlreadyExistsError;
