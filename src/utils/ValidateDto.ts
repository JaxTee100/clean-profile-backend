import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ClassValidationError } from './CustomErrors';

export async function validateDto<T>(dtoClass: new (...args: any[]) => T, body: any): Promise<T> {
 

  const dto = plainToInstance(dtoClass, body);

  if (Array.isArray(dto)) {
    throw new ClassValidationError([
      {
        property: 'body',
        constraints: {
          isNotArray: 'Only a single object is expected, not an array.',
        },
        children: [],
        value: body,
      }
    ]);
  }

  const errors = await validate(dto as object, { whitelist: true, forbidNonWhitelisted: true });

  if (errors.length > 0) {
    throw new ClassValidationError(errors); 
  }

  return dto;
}
