//[Imports]
const chalk = require("chalk"); //colorful console.logs
const mongoose = require("mongoose"); //database access
const { STITCHED_DBURL } = process.env; //load db password
const label = chalk.cyan("[DB]");

try {
  //[Connect to Stitched Database]
  mongoose.set("strictQuery", true); //force to follow schema
  const stitchedDB = mongoose.createConnection(STITCHED_DBURL);

  //[Events]
  stitchedDB.on("connecting", () => console.log(label + " Database connecting..."));
  stitchedDB.on("connected", async () => console.log(label + " Database connected."));
  stitchedDB.on("error", (error) => {
    console.error(error);
    console.log(label + " connection error:");
  });
  stitchedDB.on("disconnected", async () => console.log(label + " Database disconnected."));

  //[Validations]
  const requiredTime = function () {
    return this.reminder && this.reminder.time != null;
  };
  const timeValidate = {
    validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
    message: (props) => `time '${props.value}' is not a valid HH:mm format.`,
  };
  const dateValidate = {
    validator: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v),
    message: (props) => `date '${props.value}' is not a valid YYYY-MM-DD format.`,
  };
  const optionalDateValidate = {
    validator: (v) => v === "" || dateValidate.validator(v),
    message: dateValidate.message,
  };

  //[Schemas]
  const defaultsSchema = new mongoose.Schema(
    {
      momentOptions: {
        type: [
          {
            name: { type: String, required: true },
            quota: { type: Boolean, required: true },
            /*
            quota=true  => [frequency] times per [span]
            quota=false => every [frequency] [span]s
            */
            frequency: { type: Number, required: true, min: 1 },
            span: { type: String, required: true, enum: ["day", "week", "month"] },
            reminder: { time: { type: String, required: requiredTime, validate: timeValidate }, action: String },
            order: { type: Number, required: true, min: 1 },
          },
        ],
        required: true,
      },
      mementoOptions: {
        type: [
          {
            name: { type: String, required: true },
            category: { type: String, required: true },
            intervalFromStart: { type: Boolean, default: false },
            predict: { type: Boolean, default: false },
            group: { type: Boolean, default: false },
            order: { type: Number, required: true, min: 1 },
          },
        ],
        required: true,
      },
      memoryTitles: {
        type: [
          {
            name: { type: String, required: true },
            default: { type: Boolean, default: false },
            reminder: { time: { type: String, required: requiredTime, validate: timeValidate }, action: String },
            order: { type: Number, required: true, min: 1 },
          },
        ],
        required: true,
      },
      notifOptions: {
        type: {
          mementoReminder: { type: String, validate: timeValidate },
          simpleNotifs: { type: [{ type: [String], validate: timeValidate }], default: [] },
          useSimple: { type: Boolean, default: false },
        },
        default: {},
      },
    },
    { strict: "throw", versionKey: false }
  );
  stitchedDB.model("Defaults", defaultsSchema, "defaults");

  //[Entry schema]
  const entrySchema = new mongoose.Schema(
    {
      date: { type: String, required: true, unique: true, validate: dateValidate },
      moments: { type: [String], required: true, default: [] },
      memories: {
        type: [{ title: { type: String, required: true }, content: { type: String, default: "", trim: true } }],
        required: true,
        default: [],
      },
    },
    { strict: "throw", versionKey: false }
  );
  stitchedDB.model("Entry", entrySchema, "entry");

  const mementoSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      start: { type: String, required: true, validate: dateValidate },
      end: { type: String, validate: optionalDateValidate, default: "" },
      duration: { type: Number, min: -1, default: -1 },
    },
    { strict: "throw", versionKey: false }
  );
  stitchedDB.model("Memento", mementoSchema, "memento");

  //[Export]
  module.exports = { stitchedDB };
} catch (error) {
  console.error(error);
}
