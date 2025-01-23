import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../common/logger';
import { createAPIError } from './errorHandler';

interface ValidationConfig {
  skipMissingProperties?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  validatorOptions?: ValidatorOptions;
}

export const validationMiddleware = <T extends object>(
  dtoClass: ClassConstructor<T>,
  config: ValidationConfig = {}
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatorOptions: ValidatorOptions = {
        skipMissingProperties: config.skipMissingProperties ?? false,
        whitelist: config.whitelist ?? true,
        forbidNonWhitelisted: config.forbidNonWhitelisted ?? true,
        ...config.validatorOptions
      };

      // Transform request body to DTO instance
      const dtoInstance = plainToInstance(dtoClass, req.body, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });

      // Validate DTO
      const errors: ValidationError[] = await validate(dtoInstance, validatorOptions);

      if (errors.length > 0) {
        const formattedErrors = errors.map(err => ({
          field: err.property,
          constraints: Object.values(err.constraints || {}),
          value: err.value,
          children: err.children?.length ? err.children : undefined
        }));

        logger.warn('Validation failed', {
          path: req.path,
          method: req.method,
          errors: formattedErrors
        });

        throw createAPIError(
          400,
          'Validation failed',
          'VALIDATION_ERROR',
          formattedErrors
        );
      }

      // Attach validated data to request
      req.body = dtoInstance;
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      } else {
        next(createAPIError(400, 'Invalid request data'));
      }
    }
  };
};

// Helper function for query parameter validation
export const validateQuery = <T extends object>(
  dtoClass: ClassConstructor<T>,
  config: ValidationConfig = {}
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryInstance = plainToInstance(dtoClass, req.query);
      const errors = await validate(queryInstance, config.validatorOptions);

      if (errors.length > 0) {
        throw createAPIError(
          400,
          'Query validation failed',
          'QUERY_VALIDATION_ERROR',
          errors
        );
      }

      req.query = queryInstance as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};
