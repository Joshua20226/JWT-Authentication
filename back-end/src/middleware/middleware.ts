import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export async function middleware(this: FastifyInstance, req: FastifyRequest, reply: FastifyReply) {
    const url = req.url;
    const safeRoutes = ['/api/auth/login', '/api/auth/register']

    if (safeRoutes.includes(url)) {
        return;
    }

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
        if (!accessToken) {
            console.log('missing access token')
            return reply.code(401).send({ error: 'Missing or expired token' })
        }
        // Verify Access Token
        const accessPayload = this.jwt.verify(accessToken) as any;
        // Set userId in request for use in controllers
        (req as any).userId = (accessPayload as any).userId;
        return;
    } catch (err) {
        console.log('access token verification error:',err)
        // Verify Refresh Token
        try {
            if (!refreshToken) {
                console.log('missing refresh token')
                return reply.code(401).send({ error: 'Missing or expired token' })
            }
            const refreshPayload = this.jwt.verify(refreshToken) as any;

            // Issue new Access Token
            const newAccessToken = this.jwt.sign({ userId: refreshPayload.userId }, { expiresIn: '15m' });
            reply
            .code(200)
            .setCookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                path: '/',
                expires: new Date(Date.now() + 15 * 60 * 1000),
                maxAge: 15 * 60 * 1000,
            });
            
            // Set userId in request for use in controllers
            (req as any).userId = refreshPayload.userId;
            return;
        } catch (err) {
            return reply.code(401).send({ error: 'Missing or expired token' })
        }
    }
}