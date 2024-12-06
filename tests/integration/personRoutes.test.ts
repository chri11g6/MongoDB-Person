import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../../src/api/models/user';
import { Person } from '../../src/api/models/person';
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
	await Person.deleteMany();
});

const password = '8A9cZTyN';
const email = 'john@example.com';

beforeEach(async () => {
	const res = await request(app)
		.post('/user/signup')
		.send({ password: password, email: email });

	expect(res.statusCode).toBe(201);
	expect(res.body.message).toBe("User created");
	expect(res.body.id).not.toBeUndefined();
});

async function login(): Promise<string> {
	const res = await request(app)
		.post('/user/login')
		.send({ password: password, email: email });

	expect(res.statusCode).toBe(200);

	return res.body.token as string;
}

describe('Person Routes', () => {
	it('Post a person and get', async () => {
		const name = "John Doe";
		const age = 25;

		const token = await login();

		const postRes = await request(app)
			.post('/person')
			.auth(token, { type: 'bearer' })
			.send({ name: name, age: age });

		expect(postRes.statusCode).toBe(201);
		expect(postRes.body.message).toBe("Handling POST requests to /Person");
		expect(postRes.body.createdPerson._id).not.toBeUndefined();

		await getAndTestPerson(postRes.body.createdPerson._id, name, age, token);
	});

	it('Post a person and delete', async () => {
		const name = "John Doe";
		const age = 25;

		const token = await login();

		const postRes = await request(app)
			.post('/person')
			.auth(token, { type: 'bearer' })
			.send({ name: name, age: age });

		expect(postRes.statusCode).toBe(201);
		expect(postRes.body.message).toBe("Handling POST requests to /Person");
		expect(postRes.body.createdPerson._id).not.toBeUndefined();

		const deleteRes = await request(app)
			.delete('/person/' + postRes.body.createdPerson._id)
			.auth(token, { type: 'bearer' });

		expect(deleteRes.statusCode).toBe(200);
	});

	it('Post a person and patch', async () => {
		const name = "John Doe";
		const age = 25;

		const token = await login();

		const postRes = await request(app)
			.post('/person')
			.auth(token, { type: 'bearer' })
			.send({ name: name, age: age });

		expect(postRes.statusCode).toBe(201);
		expect(postRes.body.message).toBe("Handling POST requests to /Person");
		expect(postRes.body.createdPerson._id).not.toBeUndefined();

		await getAndTestPerson(postRes.body.createdPerson._id, name, age, token);

		const newAge = 26;

		const patchRes = await request(app)
			.patch('/person/' + postRes.body.createdPerson._id)
			.auth(token, { type: 'bearer' })
			.send({ age: newAge });

		expect(patchRes.statusCode).toBe(200);

		await getAndTestPerson(postRes.body.createdPerson._id, name, newAge, token);

		const newName = "John Doe 2";

		const patch1Res = await request(app)
			.patch('/person/' + postRes.body.createdPerson._id)
			.auth(token, { type: 'bearer' })
			.send({ name: newName });

		expect(patch1Res.statusCode).toBe(200);

		await getAndTestPerson(postRes.body.createdPerson._id, newName, newAge, token);
	});

	it('Get a list of persons', async () => {
		const personList = [
			{ name: "John Doe", age: 25 },
			{ name: "Jane Doe", age: 27 }
		];

		const token = await login();

		personList.forEach(async person => {
			const postRes = await request(app)
				.post('/person')
				.auth(token, { type: 'bearer' })
				.send({ name: person.name, age: person.age });

			expect(postRes.statusCode).toBe(201);
			expect(postRes.body.message).toBe("Handling POST requests to /Person");
			expect(postRes.body.createdPerson._id).not.toBeUndefined();
		});

		const getRes = await request(app)
			.get('/person')
			.auth(token, { type: 'bearer' });

		expect(getRes.statusCode).toBe(200);
		expect(getRes.body).toHaveLength(personList.length);
	});

	async function getAndTestPerson(id: string, name: string, age: number, token: string) {
		const getRes = await request(app)
			.get('/person/' + id)
			.auth(token, { type: 'bearer' });

		expect(getRes.statusCode).toBe(200);
		expect(getRes.body.name).toBe(name);
		expect(getRes.body.age).toBe(age);
	}
});