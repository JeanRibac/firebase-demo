const { db, admin } = require("./admin");

module.exports = async (req, res, next) => {
  try {
    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
      console.log("No token found");
      return res.status(403).json({ error: "Unauthorized" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    const data = await db
      .collection("users")
      .where("userId", "==", req.user.uid)
      .limit(1)
      .get();

    req.user.username = data.docs[0].data().username;
    req.user.imageUrl = data.docs[0].data().imageUrl;
    return next();
  } catch (err) {
    return res.status(403).json(err);
  }
};
