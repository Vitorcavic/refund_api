import { Request, Response } from "express";
import { UserRole } from "../../prisma/generated/prisma/client"
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { authConfig } from "@/config/auth";
import { sign } from "jsonwebtoken";

class SessionsController {
    async create(req: Request, res: Response) {

        const bodySchema = await z.object({
            email: z.email({ message: "E-mail inválido" }).toLowerCase(),
            password: z
            .string()
            .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
            .regex(/[A-Z]/, { message: "A senha deve ter ao menos uma letra maiúscula" })
            .regex(/[^A-Za-z0-9]/, { message: "A senha deve ter ao menos um caractere especial" }),
            role: z.enum([UserRole.employee, UserRole.manager]).default(UserRole.employee),
        })

        const { email, password } = bodySchema.parse(req.body)

        const user = await prisma.user.findFirst({ where: { email } })

        if(!user) {
            throw new AppError("E-mail ou senha inválidos", 401)
        }

        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched) {
            throw new AppError("E-mail ou senha inválidos", 401)
        }
        
        const { secret, expiresIn } = authConfig.jwt

        const token = sign({ role: user.role }, secret, {
            subject: user.id,
            expiresIn,
        })

        const { password: _, ...userWithoutPassword } = user

        return res.json({ token, userWithoutPassword })
    }
}

export { SessionsController }