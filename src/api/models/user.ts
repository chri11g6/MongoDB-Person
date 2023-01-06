import { Schema, model, Document } from 'mongoose';

export interface UserDocument extends Document {
    _id: Schema.Types.ObjectId;
    email: string;
    password: string;
}

const userSchema = new Schema<UserDocument>({
    _id: { type: Schema.Types.ObjectId },
    email: {
		type: String,
		required: true,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
    password: { type: String, required: true }
});

const User = model<UserDocument>('User', userSchema);

export {User};