import { addListener } from "process"

export const registerBodySchema = {
    type: 'object', 
    properties: {
        username: { type: 'string' }, 
        email: { type: 'string', format: 'email' }, 
        password: { type: 'string', minLength: 8 },
    },
    required: ['username', 'email', 'password'],
    additionalProperties: false
}

export const loginBodySchema = {
    type: 'object', 
    properties: {
        email: { type: 'string', format: 'email' }, 
        password: { type: 'string', minLength: 8 },
    },
    required: ['email', 'password'],
    additionalProperties: false,
    // , errorMessage: 'Password must be at least 8 characters'
    // errorMessage: {
    //     required: {
    //         email: 'Email is required',
    //         password: 'Password is required'
    //     },
    //     additionalProperties: 'No extra fields allowed'
    // }
}