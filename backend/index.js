//[Imports]
console.time("Load time");
const chalk = require("chalk"); //colorful console.logs
const express = require("express");
const cors = require("cors");
require("dotenv").config(); //enables environment variables
//Info:
const port = 8080;
const appLabel = chalk.green("[Server]");

//[Initialize app]
const app = express();
app.set("view engine", "ejs"); //define engine
app.set("views", "views"); //define views location

//[Define aid tools]
app.use(cors());
app.use(express.json());

//[Stitched backend]
const { stitchedDB } = require("./stitched/database");

//[Routes]
const stitchedRouter = require("./stitched/api");
app.use("/api", stitchedRouter);

app.all("*", (req, res) => res.sendStatus(404));

//[Launch app]
const server = app.listen(port, async () => {
  console.log(appLabel + " Backend is now online.");
  console.timeEnd("Load time");
});

//[Process events]
async function shutdownHandler(code) {
  if (stitchedDB?.readyState === 1) await stitchedDB?.close(); //prints in event

  console.log(appLabel + " Backend closed.");
  if (server) server.close(() => process.exit(code || 0));
  else process.exit(code || 0);
}
process.on("unhandledRejection", (error) => {
  console.error(error);
  shutdownHandler(1); //optional crash
});
process.on("uncaughtException", (error) => {
  console.error(error);
  shutdownHandler(1); //has to crash
});
process.on("SIGINT", () => shutdownHandler(0));
