import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "URL Shortener API",
            version: "1.0.0",
            description:
                "API REST para encurtar URLs com autenticação JWT e rastreamento de cliques",
            contact: {
                name: "API Support",
            },
        },
        servers: [
            {
                url: process.env.BASE_URL || "http://localhost:3000",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                Link: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "ID único do link",
                        },
                        original: {
                            type: "string",
                            description: "URL original",
                        },
                        shortCode: {
                            type: "string",
                            description: "Código curto único",
                        },
                        clicks: {
                            type: "integer",
                            description: "Contador de cliques",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Data de criação",
                        },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "ID único do usuário",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "Email do usuário",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensagem de erro",
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: "Authentication",
                description: "Endpoints de autenticação",
            },
            {
                name: "Links",
                description: "Gerenciamento de links encurtados",
            },
            {
                name: "Health",
                description: "Health check",
            },
        ],
    },
    apis: ["./src/routes/**/*.ts", "./src/index.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
