import mongoose, { Document } from 'mongoose';
export interface IHistory {
    _id?: mongoose.Types.ObjectId;
    title: string;
    date: Date;
    description: string;
}
export interface ICar extends Document {
    name: string;
    year: number;
    chassisNumber: string;
    imageUrl: string;
    history: IHistory[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const History: mongoose.Model<IHistory, {}, {}, {}, mongoose.Document<unknown, {}, IHistory, {}> & IHistory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const Car: mongoose.Model<ICar, {}, {}, {}, mongoose.Document<unknown, {}, ICar, {}> & ICar & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=event.d.ts.map