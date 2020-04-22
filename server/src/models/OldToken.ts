import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

interface OldTokenProps {
    _id: number;
    token: string;
}

@Table
class OldToken extends Model implements OldTokenProps {
    @PrimaryKey
    @AutoIncrement
    @Column
    _id!: number

    @Column
    token!: string;
}

export default OldToken;
