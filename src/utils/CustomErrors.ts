//importing validationError as classValidatorValidationError so it does not conflict with the ValidationError class defined in this file
import { ValidationError as ClassValidatorValidationError } from 'class-validator/types/validation/ValidationError';

export interface FiledError {
	value?: string | any;
	field?: string;
	type: string;
	reason: string;
	children?: any[];
}


export class ValidationError extends Error {
	public readonly name: string = 'ValidationError';

	readonly message: string;

	readonly errors: any[];
	constructor(msg: string, errors: FiledError[]) {
		super(msg);
		this.message = msg;

		this.errors = errors;
	}
}

export class ServiceError extends Error {
	public readonly errors: FiledError[] = [];
	public readonly name: string = 'ServiceError';
	// public readonly message:string = 'a service error was encountered';
	constructor(message: string = 'A service error was encountered', errors: FiledError[] = []) {
		super(message);
		this.message = message;
		this.addFieldError({ reason: message, type: 'REQUEST_FAILED' });
		this.addFieldErrors(errors);
	}

	public addFieldError(error: FiledError) {
		this.errors.unshift(error);
	}
	public addFieldErrors(errors: FiledError[]) {
		for (let error of errors) {
			this.addFieldError(error);
		}
	}
}

export class AuthorizationError extends ServiceError {
	public readonly name: string = 'AuthorizationError';
	constructor(msg: string, errors: FiledError[] = []) {
		super(msg, errors);
	}
}

export class ForbiddenError extends ServiceError {
	public readonly name: string = 'ForbiddenError';
	constructor(msg: string, errors: FiledError[] = []) {
		super(msg, errors);
	}
}

export class ResourceNotFoundError extends ServiceError {
	public readonly name: string = 'ResourceNotFoundError';

	constructor(message: string = 'Resource not found') {
		super(message);
		this.addFieldError({ reason: message, type: 'RESOURCE_NOT_FOUND' });
	}
}

export class ClassValidationError extends ServiceError {
	public readonly name: string = 'ClassValidationError';
	// public readonly message:string = 'validation error';

	constructor(errors: ClassValidatorValidationError[]) {
		super('Validation failed for one or more fields in your request\n  You might have the wrong fields in you request');

		this.parseValidationError(errors);
	}

	public parseValidationError(errors: ClassValidatorValidationError[], path: string = '') {
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
			if (error.children?.length) {
				this.parseValidationError(error.children, `${path}${error.property}.`);
			}
		}
	}
}

export class ResourceAlreadyExistsError extends ServiceError {
	public readonly name: string = 'ResourceAlreadyExistsError';

	constructor(message: string = 'Resource already exists') {
		super(message);
		this.addFieldError({ reason: message, type: 'RESOURCE_ALREADY_EXISTS' });
	}
}