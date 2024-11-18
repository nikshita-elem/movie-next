import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: 'src/app/api',
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Documentation',
                version: '1.0',
                description: 'My Movie API',
            },
            tags: [
                { name: 'Authentication', description: 'Api related to authentication' },
                { name: 'Movie', description: 'Api related to movies' },
            ],
            security: [],
        },
    })
    return spec
}
