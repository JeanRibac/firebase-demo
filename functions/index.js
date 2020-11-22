const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors")
const {
  getAllTodos,
  getOneTodo,
  postOneTodo,
  editTodo,
  deleteTodo,
} = require("./APIs/todos");
const {
  loginUser,
  singUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails,
} = require("./APIs/users");
const auth = require("./utils/auth");
app.use(cors({ origin: true }));

//users
app.post("/login", loginUser);
app.post("/signup", singUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetail);
app.post("/user", auth, updateUserDetails);
//todos
app.get("/todos", auth, getAllTodos);
app.post("/todo", auth, postOneTodo);
app.get("/todo/:todoId", auth, getOneTodo);
app.delete("/todo/:todoId", auth, deleteTodo);
app.put("/todo/:todoId", auth, editTodo);

exports.api = functions.region('europe-west1').https.onRequest(app);
