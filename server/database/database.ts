import { Sequelize } from "sequelize-typescript";
import User from "../src/models/User";
import OldToken from "../src/models/OldToken";
import Bill from "../src/models/Bill";

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const sequelize = new Sequelize({
    host: DB_HOST,
    database: DB_NAME,
    dialect: "mysql",
    username: DB_USER,
    password: DB_PASSWORD,
    storage: ":memory:",
    models: [ User, OldToken, Bill ]
})

export default sequelize;
