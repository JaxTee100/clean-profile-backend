import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';
import { AuthorizationError, ClassValidationError, ForbiddenError, ResourceAlreadyExistsError, ResourceNotFoundError, ServiceError } from '../utils/CustomErrors';


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = new ErrorResponse();

  if (err instanceof ClassValidationError) {
    response.setMessage(err.message);
    response.addDataValues(err);
    return res.status(422).json(response);
  }

  if (err instanceof ResourceNotFoundError) {
    response.setMessage(err.message);
    response.addDataValues(err);
    return res.status(404).json(response);
  }

  if (err instanceof ResourceAlreadyExistsError) {
    response.setMessage(err.message);
    response.addDataValues(err);
    return res.status(409).json(response);
  }

  if (err instanceof AuthorizationError || err instanceof ForbiddenError) {
    response.setMessage(err.message);
    response.addDataValues(err);
    return res.status(403).json(response);
  }

  if (err instanceof ServiceError) {
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
