import { Schema, model } from 'mongoose';

export interface IUser {
    _id: number;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    _id: { type: Schema.Types.ObjectId },
    email: {
		type: String,
		required: true,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
    password: { type: String, required: true }
});

const User = model<IUser>('User', userSchema);

export {User};