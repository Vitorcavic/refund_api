import { Request, Response } from "express"
import { UserRole } from "../../prisma/generated/prisma/client"
import { prisma } from "@/database/prisma" 
import { z } from "zod"
import { hash } from "bcrypt"
import { AppError } from "@/utils/AppError"

class UsersController {
    async create(req: Request, res: Response) {

        const bodySchema = z.object({
            name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
            email: z.string().trim().email({ message: "E-mail inválido" }).toLowerCase(),
            password: z
            .string()
            .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
            .regex(/[A-Z]/, { message: "A senha deve ter ao menos uma letra maiúscula" })
            .regex(/[^A-Za-z0-9]/, { message: "A senha deve ter ao menos um caractere especial" }),
            role: z.enum([UserRole.employee, UserRole.manager]).default(UserRole.employee),
        })

        const { name, email, password, role } = bodySchema.parse(req.body)

        const userWithSameEmail = await prisma.user.findFirst({ where: { email } })

        if(userWithSameEmail) {
            throw new AppError("Já existe um usuário cadastrado com esse e-mail")
        }

        const hashedPassword = await hash(password, 8)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            }
        })

        res.status(201).json()
    }
}

export { UsersController }