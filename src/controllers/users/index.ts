import { FastifyInstance } from "fastify";

import { userService } from "../../lib";

export const userRouter = async function (app: FastifyInstance) {
	app.post<{
		Body: {
			username: string
			email: string
			password: string
		}
	}>("user/register", {
		schema: {
			body: {
				type: "object",
				required: ["username", "email", "password"],
				properties: {
					username: { type: "string", minLength: 1 },
					email: { type: "string", minLength: 1 },
					password: { type: "string", minLength: 1 }
				}
			},
			response: {
				200: { $ref: "user#" }
			}
		}
	}, async (req, res) => {
		const registration = await userService.register(res, req.body);
		return registration;
	});
	app.post<{
		Body: {
			username: string
			password: string
		}
	}>("user/login", {
		schema: {
			body: {
				type: "object",
				required: ["username", "password"],
				properties: {
					username: { type: "string", minLength: 1 },
					password: { type: "string", minLength: 1 }
				}
			},
			response: {
				200: { $ref: "user#" }
			}
		}
	}, async (req, res) => {
		const login = await userService.login(res, req.body);
		return login;
	});
	app.get<{
		Params: {
			id: number
		}
	}>("user/me", {
		preValidation: [userService.authenticate],
		schema: {
			response: {
				200: { $ref: "user#" }
			}
		}
	}, async (req) => {
		return req.user;
	});
};
