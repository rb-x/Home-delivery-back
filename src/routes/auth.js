import express from "express";
const auth = express.Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import httpSchemaValidation from "../middlewares/validator";
import User from "../models/User";
import crypto from "crypto-random-string";
import mailer from "../services/mailer";




auth.post("/register", async (req, res) => {
  // return res.send(secret.mail.username);
  const {
    lastName,
    firstName,
    password,
    email,
    address,
    c_address,
    birth_date,
    city,
    zipcode,
    phone,
    acc_type,
    latitude,
    longitude,
    dept
  } = req.body;
  if (!acc_type) return res.status(400).send("acc_type not specified");
  const { error } = httpSchemaValidation(req.body, acc_type);

  if (error) return res.status(400).send(error.details[0].message);
  const today = new Date();
  let userData = null;
  let confirm_code = crypto({ length: 10 });

  acc_type === "client"
    ? (userData = {
      lastName,
      firstName,
      password,
      email,
      address,
      c_address,
      city,
      zipcode,
      phone,
      acc_type,
      confirm_code,
      birth_date,
      latitude,
      longitude,
      dept,
      annonces: [],
      acc_active: false,
      created_at: today,
    })
    : (userData = {
      lastName,
      firstName,
      password,
      email,
      phone,
      acc_type,
      confirm_code,
      birth_date,
      latitude,
      longitude,
      annonces: [],
      acc_active: false,
      created_at: today,
    });

  // Verification si l'utilisateur existe deja ?
  try {
    const userIsFound = await User.findOne({ email: userData.email });
    if (userIsFound)
      return res.status(409).json({ err: "Mail already registred !" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
  // chiffrement du password
  const hashedpassword = await bcrypt.hash(password, 10);
  userData.password = hashedpassword;
  // Enregistrement de l'utilisateur
  try {
    await User.create(userData);
    res
      .status(201)
      .json({ msg: "User successfully created ! , please_confirm mail" });
    //TODO sendMAIL HERE <------|+
    mailer(email, null, confirm_code);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
});

auth.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.dir("bop1")
  const { error } = httpSchemaValidation(req.body, "login");
  if (error) return res.status(400).send(error.details[0].message);
  // Verification exist ?
  const userFound = await User.findOne({
    email,
  });
  console.dir("bop2")
  if (!userFound)
    return res.status(401).json({ err: "User or password incorrect" });
  // Vérification du mot de passe
  const passwordMatch = bcrypt.compareSync(password, userFound.password);
  // creation de token JWT
  let payload = {
    id: userFound._id,
    email: userFound.email,
    firstName: userFound.firstName,
    lastName: userFound.lastName,
    acc_isActive: userFound.acc_active,
    email: userFound.email,
    phone: userFound.phone,
    acc_type: userFound.acc_type,
    city: userFound.city,
    address: userFound.address,
    latitude: userFound.latitude,
    longitude: userFound.longitude,
    zipcode: userFound.zipcode,
    dept: userFound.dept
  };
  let token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: 86400, // 24 hours
  });
  if (passwordMatch) {
    if (!userFound.acc_active)
      return res.json({ msg: "Account not active", isactive: false, token });
    return res.status(200).json({
      token,
      user: {
        id: userFound._id,
        email: userFound.email,
        created: userFound.created_at,
        acc_type: userFound.acc_type,
      },
    });
  } else {
    return res.status(401).json({ err: "User or password incorrect" });
  }
});

auth.post('/verifymail', async (req, res) => {

  const {
    secretCode
  } = req.body
  const {
    error
  } = httpSchemaValidation(req.body, 'verifymail');
  if (error) return res.status(400).send(error.details[0].message);

  const userFound = await User.findOne({
    confirm_code: secretCode
  })
  console.log(userFound)

  if (!userFound || userFound.confirm_code !== secretCode) return res.status(400).json({
    err: 'Utilisateur ou Code de verification incorrect',

  })
  else if (userFound.acc_active) return res.status(409).json({
    err: 'Compte déja activé',
  })
  else if (!userFound.acc_active && userFound.confirm_code === secretCode) {
    try {
      userFound.acc_active = true
      await userFound.save()
      res.status(200).json({
        msg: "Compte activé avec succès!"
      })
    } catch (err) {
      return res.status(500).json({ err })
    }

  }

});
auth.post('/mailresent', async (req, res) => {
  const {
    email,
  } = req.body
  const {
    error
  } = httpSchemaValidation(req.body, 'mailresent');
  if (error) return res.status(400).send(error.details[0].message)

  const userFound = await User.findOne({
    email
  })
  if (userFound.acc_active) {
    return res.status(409).json({
      "err": "Utilisateur déja confirmé",
      "code": 409
    })
  }
  else if (!userFound) return res.status(401).json({
    "err": "Utilisateur / code de confirmation incorrect",
    "code": 401
  })

  mailer(userFound.email, null, userFound.confirm_code)
    .then(() => res.status(200).json({
      msg: 'Mail Envoyé!',
      code: 200
    }))
    .catch(err => res.status(500).json({
      err
    }))
});


export default auth;
