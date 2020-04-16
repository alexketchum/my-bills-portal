import { Column, CreatedAt, Default, IsUUID, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

export interface UserProps {
    id: string;
    group_id: string;
    email: string;
    password: string;
    reminder_emails: boolean;
    created: Date;
    updated: Date;
}

@Table
class User extends Model<User> implements UserProps {
    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: string

    @Column
    group_id!: string;

    @Column
    email!: string;

    @Column
    password!: string;

    @Default(false)
    @Column
    reminder_emails!: boolean;

    @CreatedAt
    @Column
    created!: Date;

    @UpdatedAt
    @Column
    updated!: Date;
}

export default User;
