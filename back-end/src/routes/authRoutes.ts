import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { login, register, logout, checkToken } from '../controllers/authController.js';
import { loginBodySchema, registerBodySchema } from '../schema/authSchema.js';


const checkTokenOpts = {
  schema: {
    response: {
      200: {
        status_code: { type: 'string' },
        message: { type: 'string' }
      },
    }
  },
  handler: checkToken
}

const registerOpts = {
  schema: {
    body: registerBodySchema,
    response: {
      200: {

      },
      400: {

      }
    }
  },
  handler: register
}

const loginOpts = {
  schema: {
    body: loginBodySchema,
    response: {
      200: {
        status_code: { type: 'string' },
        message: { type: 'string' }, 
        error: { type: 'string' } 
      },
      400: {

      }
    }
  },
  handler: login,
  errorHandler: (error: any, request: FastifyRequest, reply: FastifyReply) => {
    if (error.validation) {
      const err = error.validation.map((v: any) => v.message).join(', ')
      console.log(error.validation)
      return reply.code(400).send({
        // status_code: '400',
        // message: 'Invalid request body',
        error: error.validation.map((v: any) => v.message).join(', ')
      })
    }
    throw error
  }
}

const logoutOpts = {
  schema: {
      response: {
        200: {
  
        },
        400: {
  
        }
      }
    },
  handler: logout
}

export default function authRoutes(fastify: FastifyInstance) {
  fastify.get('/api/auth/check_token', checkTokenOpts);
  
  fastify.post('/api/auth/register', registerOpts);

  fastify.post('/api/auth/login', loginOpts);

  fastify.post('/api/auth/logout', logoutOpts);
}
