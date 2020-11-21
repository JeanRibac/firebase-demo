const firebase = require("firebase");
const { db, admin } = require("../utils/admin");
const config = require("../utils/config");
const {
  validateLoginData,
  validateSignUpData,
} = require("../utils/validators");

firebase.initializeApp(config);

deleteImage = async (imageName) => {
  try {
    const bucket = admin.storage().bucket();
    const path = `${imageName}`;
    await bucket.file(path).delete();
  } catch (error) {
    return;
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = {
      email,
      password,
    };
    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);

    const token = await data.user.getIdToken();
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};

exports.singUpUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      password,
      confirmPassword,
      username,
    } = req.body;
    const newUser = {
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      password,
      confirmPassword,
      username,
    };

    const { valid, errors } = validateSignUpData(newUser);
    if (!valid) return res.status(400).json(errors);
    let token, userId;

    const dbUser = await db.doc(`/users/${newUser.username}`).get();
    if (dbUser.exists) {
      return res.status(400).json({ username: "this user is already taken" });
    }
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);

    userId = data.user.uid;
    token = await data.user.getIdToken();
    const userCredentials = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      phoneNumber: newUser.phoneNumber,
      country: newUser.country,
      email: newUser.email,
      createdAt: new Date().toISOString(),
      userId,
    };
    await db.doc(`/users/${newUser.username}`).set(userCredentials);
    return res.status(201).json({ token });
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return res.status(400).json({ email: "Email already in use" });
    } else {
      return res
        .status(500)
        .json({ general: "Something went wrong", error: error.message });
    }
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  // eslint-disable-next-line consistent-return
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${req.user.username}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });

  await deleteImage(imageFileName);

  busboy.on("finish", async () => {
    try {
      admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filePath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype,
            },
          },
        });
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
      await db.doc(`/users/${req.user.username}`).update({ imageUrl });
      return res.json({ message: "Image uploaded successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.code });
    }
  });

  busboy.end(req.rawBody);
};

exports.getUserDetail = async (req, res) => {
  try {
    let userData = {};
    const doc = await db.doc(`/users/${req.user.username}`).get();
    userData.userCredentials = doc.data();
    return res.json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.code });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const document = db.collection("users").doc(`${req.user.username}`);
    await document.update(req.body);
    return res.json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot Update the value" });
  }
};
