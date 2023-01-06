import { Schema, model, Document } from 'mongoose';

export interface PersonDocument extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    age: number;
}

const personSchema = new Schema<PersonDocument>({
    _id: { type: Schema.Types.ObjectId },
    name: { type: String },
    age: { type: Number }
});

const Person = model<PersonDocument>('Person', personSchema);

export {Person};