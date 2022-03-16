import { FastifyInstance } from "fastify";

import { user, auth } from "../../models";
import { NotFoundError } from "../../types";
import { hash } from "../../services";

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
	}, async (req) => {
		const { username, email, password } = req.body;
		const registration = new user({
			username,
			email,
			password: await hash(password),
			auth
		});
		await registration.save();
		const credentials = await new auth().save();
		registration.auth = credentials._id;
		return registration.save();
	});
	app.get<{
		Params: {
			id: number
		}
	}>("user/:id", {
		preValidation: [app.cache],
		schema: {
			params: {
				type: "object",
				required: ["id"],
				properties: {
					id: { type: "string" }
				}
			},
			response: {
				200: { $ref: "user#" }
			}
		}
	}, async (req) => {
		const { id } = req.params;
		const exists = await user.findById(id, null, { lean: true });
		if (!exists) throw new NotFoundError();
		return exists;
	});
};
