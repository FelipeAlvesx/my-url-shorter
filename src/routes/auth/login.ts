import express  from "express";
import { prisma } from "../../index.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function login(req: express.Request, res: express.Response) {
    const { email, password } = req.body;
    const segredo = process.env.JWT_SECRET;

    const existingUser = await prisma.user.findUnique({ where: { email }});

    const passValidation = bcrypt.compareSync(
        password,
        existingUser?.passwordHash || "",
    );

    if (!existingUser || !passValidation) {
        res.status(401).send("Unauthorized");
        return;
    }

    const token = jwt.sign({ email }, segredo!, { expiresIn: "1h" });
    res.json({ token });
}