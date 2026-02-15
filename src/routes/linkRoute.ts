import Router from "express";
import { createLink } from "./links/create.ts";
import { redirectLink } from "./links/redirect.ts";
import { findAll } from "./links/findAll.ts";
import { jwtMiddleware } from "../middlewares/jwtMiddleware.ts";

export const linkRouter = Router();

/**
 * @swagger
 * /links:
 *   post:
 *     summary: Criar link encurtado
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - original
 *             properties:
 *               original:
 *                 type: string
 *                 format: uri
 *                 example: https://github.com/prisma/prisma
 *     responses:
 *       201:
 *         description: Link criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Link criado com sucesso!
 *                 shortCode:
 *                   type: string
 *                   example: abc123
 *                 url:
 *                   type: string
 *                   example: http://localhost:3000/abc123
 *       400:
 *         description: URL inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado
 */
linkRouter.post("/links", jwtMiddleware, createLink);

/**
 * @swagger
 * /{code}:
 *   get:
 *     summary: Redirecionar para URL original
 *     tags: [Links]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código curto do link
 *         example: abc123
 *     responses:
 *       302:
 *         description: Redirecionamento para URL original
 *       404:
 *         description: Link não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
linkRouter.get("/:code", redirectLink);

/**
 * @swagger
 * /links/all:
 *   get:
 *     summary: Listar todos os links
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Link'
 *       401:
 *         description: Não autorizado
 */
linkRouter.get("/links/all", jwtMiddleware, findAll);
