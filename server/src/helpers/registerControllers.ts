import * as fs from "fs";
import * as util from "util";
import * as path from "path";

const BASE_DIR = path.join(__dirname, "../controllers");
const readdir = util.promisify(fs.readdir);

// This will dynamically add controllers to be registered on start up,
const getControllers = async () => {
    const controllers: any = [];
    const files = await readdir(BASE_DIR);

    files.forEach((file) => {
        const filePath = BASE_DIR + "/" + file;
        const controller = require(filePath);
        const newController = new controller.default();

        controllers.push(newController);
    });

    return controllers;
}

export default getControllers;
