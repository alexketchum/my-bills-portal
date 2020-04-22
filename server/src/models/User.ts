import { Column, CreatedAt, Default, IsUUID, Model, PrimaryKey, Table, UpdatedAt, DataType, AllowNull } from "sequelize-typescript";

export interface UserProps {
    id: string;
    group_id: string;
    email: string;
    password: string;
    reminder_emails?: boolean;
    reminder_dates?: object;
    created?: Date;
    updated?: Date;
}

@Table
class User extends Model<User> implements UserProps {
    @IsUUID(4)
    @PrimaryKey
    @AllowNull(false)
    @Column
    id!: string

    @IsUUID(4)
    @AllowNull(false)
    @Column
    group_id!: string;

    @AllowNull(false)
    @Column
    email!: string;

    @AllowNull(false)
    @Column
    password!: string;

    @Default(false)
    @Column
    reminder_emails!: boolean;

    @Column(DataType.JSON)
    reminder_dates!: object;

    @CreatedAt
    @Column
    created!: Date;

    @UpdatedAt
    @Column
    updated!: Date;
}

export default User;
