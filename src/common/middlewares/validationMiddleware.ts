import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { logger } from '@common/logger';

interface ValidationConfig {
  skipMissingProperties?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  validatorOptions?: ValidatorOptions;
}

export const validationMiddleware = <T extends object>(
  dtoClass: ClassConstructor<T>,
  config: ValidationConfig = {},
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatorOptions: ValidatorOptions = {
        skipMissingProperties: config.skipMissingProperties ?? false,
        whitelist: config.whitelist ?? true,
        forbidNonWhitelisted: config.forbidNonWhitelisted ?? true,
        ...config.validatorOptions,
      };

      const dtoInstance = plainToInstance(dtoClass, req.body);

      const errors: ValidationError[] = await validate(
        dtoInstance,
        validatorOptions,
      );

      if (errors.length > 0) {
        const message = errors
          .map((err) => Object.values(err.constraints || {}))
          .flat()
          .join(', ');

        throw new Error(`Validation failed: ${message}`);
      }

      // Attach validated data to request
      req.body = instanceToPlain(dtoInstance);
      next();
    } catch (error) {
      next(error);
    }
  };
};
