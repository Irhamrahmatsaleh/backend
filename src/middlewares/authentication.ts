import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export function authenticateToken(req: Request, res: Response, next: NextFunction)
{
    const authHeader = req.headers.authorization;
    //Bearer Token Check
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Unauthorized!",
        })
    }

    const token = authHeader.split(" ")[1];

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.verifyingUser = user;
        next();
    } catch(err) {
        return res.status(401).json({
            error: "Unauthorized!",
          });
    }
}