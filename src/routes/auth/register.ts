import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../index.ts";

export async function register(req: express.Request, res: express.Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        res.status(409).json({ message: "User already exists" });
        return;
    }
    const newUser = { email, passwordHash: bcrypt.hashSync(password, 10) };
    console.log(newUser);
    await prisma.user.create({ data: newUser });
    res.status(201).json({ message: "User Created" });
}