import { Schema, model } from 'mongoose';

export interface IPerson {
    _id: number;
    name: string;
    age: number;
}

const personSchema = new Schema<IPerson>({
    _id: { type: Schema.Types.ObjectId },
    name: { type: String },
    age: { type: Number }
});

const Person = model<IPerson>('Person', personSchema);

export {Person};