import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginBody, registerBody } from "../schema/authType.js";
import { comparePassword, hashingPassword } from "../utils/bcryptPassword.js";
import User from "../models/User.js";

export async function register(req: FastifyRequest<{ Body: registerBody }>, reply: FastifyReply) {
  const { username, email, password } = req.body;

  // Checking for duplicate email or username
  const conflict = await User.findOne({
      $or: [{ email }, { username }]
  }).lean()

  if (conflict) {
    console.log(conflict)
    if (conflict.email === email) {
      return reply.code(409).send({ error: 'Email is already registered' })
    } else {
      return reply.code(409).send({ error: 'Username is already taken' })
    }
  }

  const hashedPassword = await hashingPassword(password);
  const newUser = await User.create({ username: username, email: email, password: hashedPassword})
  await newUser.save()

  return reply.code(200).send({ message: 'registeration successful' });
}

export async function login(this: FastifyInstance, req: FastifyRequest<{ Body: loginBody }>, reply: FastifyReply) {
    const { email, password } = req.body;
  
    console.log('Login attempt for:', email); // Debug log

    // Find user by email (email)
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for:', email);
      return reply.code(400).send({ error: 'Invalid email or password' });
    }

    // Check password
    if (!await comparePassword(password, user.password)) {
      console.log('Wrong password for user:', email);
      return reply.code(400).send({ error: 'Invalid email or password' });
    }

    // Log the login
    console.log('🔑 User Logged In:', {
      id: user._id,
      username: user.username,
      email: user.email
    });

    // Generate Access Token
    const access_token = this.jwt.sign(
      { userId: user._id },
      { expiresIn: '15m' }
    );
    console.log('access token created:', access_token)
    // Generate Refresh Token
    const refresh_token = this.jwt.sign(
      { userId: user._id },
      { expiresIn: '30d' }
    );
    console.log('refresh token created:', refresh_token)

    // Set cookies with more permissive settings for development
    reply
        .setCookie('accessToken', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
            expires: new Date(Date.now() + 15 * 60 * 1000),
            maxAge: 15 * 60 * 1000 // 15 minutes
        })
        .setCookie('refreshToken', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
    return reply.code(200).send({ message: 'login successful', user: { _id: user._id, username: user.username, email: user.email }});
}

export async function logout(req: FastifyRequest, reply: FastifyReply) {
    // Clear both access and refresh token cookies
    reply
        .clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
        })
        .clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
        });
    
    return reply.code(200).send({ message: 'Logged out successfully' });
}

export async function checkToken(req: FastifyRequest, reply: FastifyReply){
  // return user info
  const userId = req.userId as string
  if (!userId) {
    return reply.code(401).send({ error: 'Not authenticated' })
  }

  // Fetch only the bits you need
  const user = await User.findById(userId).select('username email').lean()
  if (!user) {
    return reply.code(404).send({ error: 'User not found' })
  }

  return reply.code(200).send({ message: 'login successful', user: { _id: userId, username: user.username, email: user.email }});
}