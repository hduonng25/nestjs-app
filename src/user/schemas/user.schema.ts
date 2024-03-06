import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
    @Prop({ required: true })
    id: string;

    @Prop({ required: false })
    name: string;

    @Prop({ required: false })
    email: string;

    @Prop({ required: false })
    password: string;

    @Prop({ required: false, default: 0 })
    failed_login: number;

    @Prop({ required: false })
    roles: string[];

    @Prop({ required: false })
    last_locked: Date;

    @Prop({ required: false, default: new Date() })
    created_date: Date;

    @Prop({ required: false, default: false })
    is_deleted: Boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
// export default UserSchema;
