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
    }
}