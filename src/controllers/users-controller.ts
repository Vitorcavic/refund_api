import { Request, Response } from "express"
import { UserRole } from "../../prisma/generated/prisma/client"
import { z } from "zod"

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

        res.json({ name, email, password, role })
    }
}

export { UsersController }