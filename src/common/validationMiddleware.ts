// import { plainToInstance } from 'class-transformer';
// import { validate, ValidationError } from 'class-validator';
// import { Request, Response, NextFunction } from 'express';

// export function validationMiddleware<T>(
//   type: any,
// ): (req: Request, res: Response, next: NextFunction) => void {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const dtoObject = plainToInstance(type, req.body);
//     validate(dtoObject).then((errors: ValidationError[]) => {
//       if (errors.length > 0) {
//         res.status(400).json({
//           status: 400,
//           message: 'Validation failed',
//           errors: errors.map((err) => ({
//             property: err.property,
//             constraints: err.constraints,
//           })),
//         });
//       } else {
//         next();
//       }
//     });
//   };
// }

import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

const validationMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorDetails = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return next({
        status: 400,
        message: 'Validation failed',
        errors: errorDetails,
      });
    }
    next();
  };
};

export default validationMiddleware;
