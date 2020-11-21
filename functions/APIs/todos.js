const { db } = require("../utils/admin");

exports.getAllTodos = async (req, res) => {
  try {
    const todos = [];
    const data = await db
      .collection("todos")
      .where("username", "==", req.user.username)
      .orderBy("createdAt", "desc")
      .get();

    data.forEach((doc) =>
      todos.push({
        todoId: doc.id,
        title: doc.data().title,
        body: doc.data().body,
        createdAt: doc.data().createdAt,
      })
    );
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getOneTodo = async (req, res) => {
  try {
    const document = db.collection("todos").doc(`${req.params.todoId}`);
    const doc = await document.get();
    const returnObject = {
      todoId: doc.id,
      title: doc.data().title,
      body: doc.data().body,
      createdAt: doc.data().createdAt,
      username: doc.data().username,
    }
    return res.status(200).json(returnObject);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.postOneTodo = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (body.trim() === "") {
      return res.status(400).json({ body: "Body must not be empty" });
    }
    if (title.trim() === "") {
      return res.status(400).json({ title: "Title must not be empty" });
    }
    const newTodoItem = {
      title,
      body,
      username: req.user.username,
      createdAt: new Date().toISOString(),
    };
    const newTodo = await db.collection("todos").add(newTodoItem);

    newTodoItem.id = newTodo.id;
    return res.status(201).json(newTodoItem);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const document = db.doc(`/todos/${req.params.todoId}`);
    const doc = await document.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Todo not found" });
    }
    if (doc.data().username !== req.user.username) {
      return res.status(403).json({ error: "Unathorized" });
    }
    await document.delete();
    return res.status(200).json({ message: "Todo deleted!" });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.editTodo = async (req, res) => {
  try {
    const { title, body } = req.body;
    const updateObj = {};
    if (title) {
      updateObj.title = title;
    }
    if (body) {
      updateObj.body = body;
    }
    if (!body && !title) {
      return res.status(400).json({ message: "There is no content" });
    }
    const document = db.collection("todos").doc(`${req.params.todoId}`);
    await document.update(updateObj);
    return res.status(200).json({ message: "Todo updated!" });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
