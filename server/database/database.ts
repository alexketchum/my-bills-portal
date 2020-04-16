import { Sequelize } from "sequelize-typescript";
import User from "../src/models/User";
import OldToken from "../src/models/OldToken";

const sequelize = new Sequelize({
    host: '127.0.0.1',
    database: "bills_portal",
    dialect: "mysql",
    username: "root",
    password: "root",
    storage: ":memory:",
    models: [ User, OldToken ]
})

export default sequelize;
