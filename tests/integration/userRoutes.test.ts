import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../../src/api/models/user';
import app from '../../src/app';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
	process.env.JWT_KEY = 'test-key123';
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri);
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

afterEach(async () => {
	await User.deleteMany();
});

const password = '8A9cZTyN';
const email = 'john@example.com';

describe('User Routes', () => {
	describe('Signup', () => {
		it('Signup a user', async () => {
			const res = await request(app)
				.post('/user/signup')
				.send({ password: password, email: email });
	
			expect(res.statusCode).toBe(201);
			expect(res.body.message).toBe("User created");
			expect(res.body.id).not.toBeUndefined();
		});

		it('Signup with wrong email', async () => {
			const res = await request(app)
				.post('/user/signup')
				.send({ password: password, email: 'john-example.com' });
	
			expect(res.statusCode).toBe(500);
		});

		it('Try to Signup with existing email', async () => {
			const res = await request(app)
				.post('/user/signup')
				.send({ password: password, email: email });
	
			expect(res.statusCode).toBe(201);
			expect(res.body.message).toBe("User created");

			const res1 = await request(app)
				.post('/user/signup')
				.send({ password: password, email: email });

			expect(res1.statusCode).toBe(409);
			expect(res1.body.message).toBe("Mail exits");
		});
	});

	describe('Login', () => {
		beforeEach(async () => {
			const res = await request(app)
				.post('/user/signup')
				.send({ password: password, email: email });
	
			expect(res.statusCode).toBe(201);
			expect(res.body.message).toBe("User created");
			expect(res.body.id).not.toBeUndefined();
		});

		it('Login a user', async () => {
			const res = await request(app)
				.post('/user/login')
				.send({ password: password, email: email });
	
			expect(res.statusCode).toBe(200);
			expect(res.body.message).toBe("Auth successful");
			expect(res.body.token).not.toBeUndefined();

			const decoded = jwt.decode(res.body.token) as jwt.JwtPayload;
			expect(decoded.email).toBe(email);

		});

		it('Login with wrong user', async () => {
			const res = await request(app)
				.post('/user/login')
				.send({ password: password, email: 'john1@example.com' });
	
			expect(res.statusCode).toBe(401);
			expect(res.body.message).toBe("Auth failed");
		});
	});

	describe('Delete', () => {
		it('Delete a user', async () => {
			const createUserRes = await request(app)
				.post('/user/signup')
				.send({ password: password, email: email });
	
			expect(createUserRes.statusCode).toBe(201);
			expect(createUserRes.body.message).toBe("User created");
			expect(createUserRes.body.id).not.toBeUndefined();

			const deleteUserRes = await request(app)
				.delete('/user/' + createUserRes.body.id);

			expect(deleteUserRes.statusCode).toBe(200);
			expect(deleteUserRes.body.message).toBe("User deleted");
		});

		it('Try to delete a non existing user', async () => {
			const deleteUserRes = await request(app)
				.delete('/user/1239');

			expect(deleteUserRes.statusCode).toBe(500);
		});
	});
});