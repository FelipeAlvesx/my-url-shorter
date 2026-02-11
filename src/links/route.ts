import Router from "express";
import { PrismaClient, type Link } from "@prisma/client";
import { adapter } from "../db/db-config.ts";

const prisma = new PrismaClient({ adapter });

export const linkRouter = Router();

linkRouter.post("/links", async (req, res) => {
    const { original } = req.body;
    const payload = {
        original,
        shortCode: Math.random().toString(36).substring(2, 8), // Gera um código curto aleatório
        createdAt: new Date(),
        clicks: 0,
    };

    await prisma.link.create({ data: payload });
    res.status(201).json({
        message: "Link criado com sucesso!",
        url: `http://localhost:3000/${payload.shortCode}`,
    });
});

linkRouter.get("/:code", async (req, res) => {
    const { code } = req.params;
    const link = await prisma.link.findUnique({ where: { shortCode: code } });

    if (!link) {
        return res.status(404).json({ message: "Link não encontrado" });
    }

    await prisma.link.update({
        where: { shortCode: code },
        data: { clicks: link.clicks + 1 },
    });

    res.status(302).redirect(link.original);
});
