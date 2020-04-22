import AppServer from "./AppServer";

const port = Number(process.env.PORT);
const appServer = new AppServer();

appServer.start(port);
