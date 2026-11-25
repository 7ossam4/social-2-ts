import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

export const validateId =
  (...params: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    for (const p of params) {
      if (!isValidObjectId(req.params[p])) {
        res.status(400).json({ message: `Invalid ${p}` });
        return;
      }
    }
    next();
  };
