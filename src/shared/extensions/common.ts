import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
export async function generateHash(data: string) {
    const saltRound = process.env.SALT_ROUND;
    return await hash(data, Number(saltRound));
}

export async function compareHash(data: string, hash: string) {
    return await compare(data, hash);
}

export function generateJwtToken(data: { _id: string, email: string }) {
    const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
    const expiryTime = process.env.TOKEN_EXPIRY_TIME;

    return sign(data, jwtPrivateKey, {
        expiresIn: Number(expiryTime)
    });
}
