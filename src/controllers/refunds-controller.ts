import { Request, Response } from "express";
import {z} from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

const CategoriesEnum = z.enum([ 
    "food", 
    "others", 
    "services", 
    "transport", 
    "accommodation" 
])

class RefundsController {
    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(2, { message: "Informe o nome da solicitação" }),
            category: CategoriesEnum,
            amount: z.number().positive({ message: "O valor precisar ser positivo" }),
            filename: z.string().min(20)
        })

        const { name, category, amount, filename } = bodySchema.parse(req.body)

        if(!req.user?.id) {
            throw new AppError("Unauthorized", 401)
        }

        const refund = await prisma.refunds.create({
            data: {
                name,
                category,
                amount,
                filename,
                userId: req.user.id
            }
        })

        return res.status(201).json(refund)
    }
}

export { RefundsController }