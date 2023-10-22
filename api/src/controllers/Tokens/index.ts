import jwt from 'jsonwebtoken'
import env from '../../env'
import { Types } from 'mongoose'
import { TokensBlackList } from '../../database/schemas/Token'

// Refresh Token

const refreshTokenDuration = '7d'
const secretRefreshToken = process.env.SECRET_JWT_REFRESH ?? env.SECRET_JWT_REFRESH

export function generateRefreshToken(userId: Types.ObjectId) {
    const payload = {
        userId,
        type: 'refresh'
    }

    const token = jwt.sign(payload, secretRefreshToken, { expiresIn: refreshTokenDuration })
    return token
}

export async function validateRefreshToken(token: string) {
    const blToken = await TokensBlackList.findOne({ token })
    if(blToken !== null) return null

    try {
        const decoded = jwt.verify(token, secretRefreshToken) as { sub: string };
        return decoded.sub;
    } catch (error) {
        return null; // Token inválido ou expirado
    }
}

// Auth Token 

const authTokenDuration = '1h'
const secretAuthToken = process.env.SECRET_JWT_AUTH ?? env.SECRET_JWT_AUTH

export function generateAuthToken(userId: Types.ObjectId, accessLevel: number) {
    const payload = {
        userId,
        accessLevel,
        type: 'auth'
    }

    const token = jwt.sign(payload, secretAuthToken, { expiresIn: authTokenDuration })
    return token
}

export async function validateAuthToken(token: string) {
    const blToken = await TokensBlackList.findOne({ token })
    if(blToken !== null) return null
    
    try {
        const decoded = jwt.verify(token, secretAuthToken) as { sub: string; accessLevel: number };
        return decoded;
    } catch (error) {
        return null; // Token inválido ou expirado
    }
}
