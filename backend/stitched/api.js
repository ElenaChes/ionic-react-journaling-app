//[Imports]
const express = require("express");
const router = express.Router();
//[Access to database]
const { stitchedDB } = require("./database");
const Defaults = stitchedDB.model("Defaults");
const Entry = stitchedDB.model("Entry");
const Memento = stitchedDB.model("Memento");
const codes = {
  ok: { status: 200, response: "Ok" },
  noContent: { status: 204, response: "" },
  badReq: { status: 400, response: "Bad request" },
  unaothReq: { status: 401, response: "Missing authentication." },
  forbiddenReq: { status: 403, response: "Identification missing access." },
  internalReq: { status: 500, response: "Something went wrong while processing request." },
};
const ACCESS_KEY = process.env.STITCHED_API;

//[Middleware]
router.use((req, res, next) => {
  try {
    if (!ACCESS_KEY) {
      console.log("api.js: No ACCESS_KEY was found.");
      return res.json(codes.internalReq);
    }
    const key = req.headers?.authorization?.split(" ")?.[1];
    if (!key) return res.json(codes.unaothReq);
    if (key !== ACCESS_KEY) return res.json(codes.forbiddenReq);

    next();
  } catch (error) {
    console.error(error);
    return res.json(codes.internalReq);
  }
});

//[Fetch data]
router.get("/fetchall", async (req, res) => {
  try {
    let response = {};
    response.defaults = await Defaults.findOne(); //can only have 1
    response.entries = await Entry.find();
    response.mementos = await Memento.find();

    return res.json({ status: codes.ok.status, response });
  } catch (error) {
    console.error(error);
  }
  return res.json(codes.internalReq);
});

//[Edit a document]
router.post("/editentry", async (req, res) => {
  try {
    const { date, moments, memories } = req.body;
    if (!date) return res.json({ status: codes.badReq.status, response: "Missing `date` in entry." });
    const id = req.body.id || req.body._id;
    let entryObject = id ? await Entry.findById(id) : null;
    if (!entryObject) {
      entryObject = await Entry.findOne({ date: date }); //fallback (didn't find by id)
      //Adding a document
      if (!entryObject) {
        entryObject = await Entry.create({ date, moments: moments || [], memories: memories || [] });
        return res.json({ status: codes.ok.status, response: entryObject?._id });
      }
    }
    //Editing a document
    if (moments.length > 0 || memories.some((memory) => memory.content)) {
      await Entry.findByIdAndUpdate(id, { moments: moments || [], memories: memories || [] });
      return res.json({ status: codes.ok.status });
    }
    //Deleting a document
    entryObject.deleteOne().catch(console.error);
    return res.json({ status: codes.noContent.status });
  } catch (error) {
    console.error(error);
  }
  return res.json(codes.internalReq);
});

//[Edit a memento]
router.post("/editmemento", async (req, res) => {
  try {
    const { name, start, end, duration } = req.body;
    if (!name) return res.json({ status: codes.badReq.status, response: "Missing `name` in memento." });
    const id = req.body.id || req.body._id;
    let mementoObject = id ? await Memento.findById(id) : null;
    //Adding a document
    if (!mementoObject) {
      mementoObject = await Memento.create({ name, start, end: end || "", duration: duration || -1 });
      return res.json({ status: codes.ok.status, response: mementoObject?._id });
    }
    //Editing a document
    if (start) {
      await Memento.findByIdAndUpdate(id, { start, end: end || "", duration: duration || -1 });
      return res.json({ status: codes.ok.status });
    }
    //Deleting a document
    mementoObject.deleteOne().catch(console.error);
    return res.json({ status: codes.noContent.status });
  } catch (error) {
    console.error(error);
  }
  return res.json(codes.internalReq);
});

//[Export]
module.exports = router;
