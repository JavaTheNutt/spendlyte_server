import { Request } from "express";

export interface IRequest extends Request {
	user: {
		uid: string,
		iss: string,
		aud: string,
		auth_time: number,
		user_id: string,
		sub: string,
		iat: number,
		exp: number,
		email: string,
		email_verified: boolean,
		firebase: any
	}
}
