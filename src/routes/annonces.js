import express from "express";
import authroute from "../middlewares/auth";
import validator from "../middlewares/validator";
import User from "../models/User";
import Annonce from "../models/Annonce";
const router = express.Router();

router.get("/fetch", authroute, async (req, res) => {
  //fetch personal annonce
  try {
    const annonces = await Annonce.find({ created_by: req.user.id });
    return res.status(200).send({ annonces, length: annonces.length });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/fetchAll", authroute, async (req, res) => {
  //fetch all active annonce 
  try {
    const annonces = await Annonce.find({ status: "active" });
    return res.status(200).send({ annonces, length: annonces.length });
  } catch (error) {
    return res.status(500).send({ error });
  }
});



/**
 * @protected Route
 */
router.post("/create", authroute, async (req, res) => {
  //we should create an annonce based on the JWT we receive
  //we intercept the token
  // we create a Annonces , we catch the annonce ID we set it to user
  const { data } = req.body;
  console.log(data);
  const { error } = validator(data, "annonce");
  if (error) return res.status(401).send(error.details[0].message);
  const annonce_data = data;
  annonce_data.created_by = req.user.id;
  annonce_data.status = "active";
  annonce_data.dept = req.user.dept;
  // res.json({ user: req.user, course: annonce_data });
  let user = await User.findById(req.user.id);
  if (req.user.acc_type !== "client")
    return res.json({
      msg: "Not allowed to create annonces ",
      acc_type: req.user.acc_type,
    });
  let new_annonce = null;
  new_annonce = await Annonce.create(annonce_data);
  user.annonces = [...user.annonces, new_annonce._id];
  try {
    await new_annonce.save();
    await user.save();
    return res.json(new_annonce);
  } catch (error) {
    res.json({ error });
  }
});

/**
 * @protected Route ( prise en charge par un benevol)
 */
router.put("/handle", authroute, async (req, res) => {
  const { annonce_id } = req.body;
  if (!annonce_id) return res.status(400).json({ msg: "Invalid request" });

  //req.user.id
  // recuperation id annoce et id livreur <localsto>
  const annonce_is_found = await Annonce.findById(annonce_id);
  if (!annonce_is_found || annonce_is_found.status !== "active")
    return res.json({ err: "annonce_id not found" });

  const annonce = await Annonce.findById(annonce_id);
  annonce.handled_by = req.user.id;
  annonce.status = "handled";
  await annonce.save();
  return res.json(annonce);
});

/**
 * @protected Route , mise à jour
 */
router.put("/update", authroute, async (req, res) => {
  let { annonce_id, step } = req.body;
  if (!annonce_id || !step)
    return res
      .status(400)
      .json({ msg: "Invalid request , annonce_id not provided" });

  let annonce_is_found = await Annonce.findById(annonce_id);
  if (!annonce_is_found) return res.json({ err: "annonce_id not found" });

  switch (step) {
    case "1":
      step = "active";
      break;
    case "2":
      step = "handled";
      break;

    case "3":
      step = "in_store";
      break;

    case "4":
      step = "rcpt_sent";
      break;

    case "5":
      step = "received_to_home";
      break;
    case "6":
      step = "completed";
      break;

    default:
      return res.status(400).json({ error: "Incorrect step received" });
      break;
  }
  console.log(step);
  annonce_is_found.status = step;

  try {
    await annonce_is_found.save();
    return res.json({ msg: "step updated successfully" });
  } catch (error) {
    return res.json({ error });
  }
});

router.delete("/delete", authroute, async (req, res) => {
  const { annonce_id } = req.body;
  if (!annonce_id)
    return res.status(400).json({ err: "annonce_id not received" });

  let annonce_is_found = null;
  try {
    annonce_is_found = await Annonce.findById(annonce_id);
  } catch (error) {
    return res.json({ error });
  }
  if (!annonce_is_found) res.json({ error: "Invalid annonce_id" });
  if (annonce_is_found.status !== "active")
    return res.json({ msg: "deletion is not permitted at this point" });
  console.log(
    "test :",
    JSON.stringify(annonce_is_found.created_by),
    JSON.stringify(req.user.id)
  );

  if (
    JSON.stringify(annonce_is_found.created_by) !== JSON.stringify(req.user.id)
  )
    return res
      .status(403)
      .json({ err: "Not Authorized to perform this action " });
  try {
    const annonce_deleted = await Annonce.findByIdAndDelete(
      annonce_is_found._id
    );
    return res.json({ deleted: true, annonce_deleted });
  } catch (err) {
    return res.json({ error });
  }
});



router.post("/resolve", authroute, async (req, res) => {
  // TODO SANITIZE ! 
  // return the annonce with its creator 
  const { annonce_id } = req.body
  if (!annonce_id || annonce_id.length >= 20 || typeof (dept_name) !== 'string') return res.send({ err: "annonce_id is required" })
  if (req.user.acc_type !== "helper") return res.status(401).send({ err: "Not authorized to perform this action" })
  try {
    let annonce_found = await Annonce.findById(annonce_id)
    if (!annonce_found) return res.status(404).send({ err: "Annonce not found" })
    let user_found = await User.findById(annonce_found.created_by)
    return res.send({ user_found, annonce_found })
  } catch (err) {
    return res.status(404).send({ err: "id Not found" })
  }
})

router.post("/fetchdeptactive", async (req, res) => {
  // TODO SANITIZE WITH JOI
  // fetch active annonce by dept 
  const { dept_name } = req.body
  if (!dept_name || dept_name.length >= 20 || typeof (dept_name) !== 'string') return res.send({ err: "dept_name is required" })

  try {
    const annonces = await Annonce.find({ status: "active", dept: dept_name });
    return res.status(200).send({ annonces, length: annonces.length });
  } catch (error) {
    return res.status(500).send({ error });
  }
})

export default router;
