import express from "express";
import { prisma } from "../../index.ts";

export async function findAll(req: express.Request, res: express.Response) {
    const links = await prisma.link.findMany();
    res.status(200).json(links);
}