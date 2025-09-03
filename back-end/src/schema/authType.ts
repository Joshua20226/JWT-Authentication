export interface registerBody {
  username: string, 
  email: string, 
  password: string,
}

export interface loginBody {
    email: string, 
    password: string, 
}

export interface forgotPasswordBody { 
    email: string
}

export interface logoutBody {
    token: string,
}