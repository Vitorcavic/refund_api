import { Request, Response } from "express";
import {z} from "zod";

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
            amount: z.number().positive({ message: "O valor precisar ser postivo" }),
            filename: z.string()
        })

        const { name, category, amount, filename } = bodySchema.parse(req.body)

        return res.json({ message: "OK" })
    }
}

export { RefundsController }