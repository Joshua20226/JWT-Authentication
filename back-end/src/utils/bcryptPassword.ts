import bycrypt from 'bcryptjs';

export async function hashingPassword(password: string) {
    const saltRound = 12;
    return await bycrypt.hash(password, saltRound)
}

export async function comparePassword(password: string, hashedPassword: string) {
    return bycrypt.compare(password, hashedPassword);
}
