import AppServer from "./AppServer";

const port = Number(process.env.port);
const appServer = new AppServer();

appServer.start(port);
