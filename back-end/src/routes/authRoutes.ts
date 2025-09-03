import { FastifyInstance } from 'fastify';
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
        token: { type: 'string' } 
      },
      400: {

      }
    }
  },
  handler: login
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
