import { prisma } from "../../index.ts";
import express from "express";
import validator from "validator";

function isValidUrl(str: string): boolean {
    if (typeof str !== "string" || validator.isEmpty(str, { ignore_whitespace: true })) {
        return false;
    }
    return validator.isURL(str, {
        protocols: ["http", "https"],
        require_protocol: true,
        require_valid_protocol: true,
        require_host: true,
        require_tld: true,
    });
}

export async function createLink(req: express.Request, res: express.Response) {
    const { original } = req.body;
    if(!original || !isValidUrl(original)) {
        return res.status(400).json({ message: "URL inválida" });
    }
    const shortCode = Math.random().toString(36).substring(2, 8) // Gera um código curto aleatório
    const link = await prisma.link.create({ data: { original, shortCode, clicks: 0, createdAt: new Date() } });
    res.status(201).json({
        message: "Link criado com sucesso!",
        shortCode: link.shortCode,
        url: `${process.env.BASE_URL}/${shortCode}`,
    });
}
