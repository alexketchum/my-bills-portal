import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

interface OldTokenProps {
    id: number;
    token: string;
}

@Table
class OldToken extends Model implements OldTokenProps {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number

    @Column
    token!: string;
}

export default OldToken;
