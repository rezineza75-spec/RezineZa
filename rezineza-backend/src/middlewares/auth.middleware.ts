import { Request, Response ,NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth"

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
declare global {
    namespace Express{
        interface Request {
            userId?: string;
            userRole?: string;
        }
    }
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session?.user?.id) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    req.userId = session.user.id;
    req.userRole = session.user.role ?? undefined;
    next();
  } catch (error) {
    res.status(401).json({ message: "Non authentifié" });
  }
};