import { Column, CreatedAt, IsUUID, Model, PrimaryKey, Table, UpdatedAt, DataType, AllowNull } from "sequelize-typescript";

export interface BillProps {
    _id: string;
    group_id: string;
    name: string;
    due_date?: number;
    amount_due?: number;
    amount_left?: number;
    login?: string;
    password?: string;
    url?: string;
    notes?: string;
    created_at?: Date;
    updated_at?: Date;
}

class Bill extends Model<Bill> implements BillProps {
    @IsUUID(4)
    @PrimaryKey
    @AllowNull(false)
    @Column
    _id!: string;

    @IsUUID(4)
    @AllowNull(false)
    @Column
    group_id!: string;

    @AllowNull(false)
    @Column
    name!: string;

    @Column
    due_date!: number;

    @Column
    amount_due!: number;

    @Column
    amount_left!: number;

    @Column
    login!: string;

    @Column
    password!: string;

    @Column
    url!: string;

    @Column(DataType.TEXT)
    notes!: string;

    @CreatedAt
    @Column
    created_at!: Date;

    @UpdatedAt
    @Column
    updated_at!: Date;
}

export default Bill;
