import { Request, Response, NextFunction } from "express";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (session?.user?.role !== "admin") {
            res.status(403).json({ message: "Accès refusé" });
            return;
        }

        next();
    } catch (error) {
        res.status(403).json({ message: "Accès refusé" });
    }
};