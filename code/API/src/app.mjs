import express from "express";
import responseSize from "express-response-size";

import { initDB,sequelize } from "./db/sequelize.mjs";

import { customerRouter } from "./routes/users.mjs";
import { loginRouter } from "./routes/login.mjs";
import { booksRouter } from "./routes/routes_t_books.mjs";
import { categorysRouter } from "./routes/routes_t_categorys.mjs";
import { commentsRouter } from "./routes/routes_t_comments.mjs";
import { authorRouter } from "./routes/routes_t_authors.mjs";

const app = express();
app.use(express.json());
app.use(responseSize(300));
const port = 3000;

 sequelize
    .authenticate()
    .then((_) => console.log("la connexion à la base de donnée à bien été établie")
    )
    .catch((error) => console.error("Impossible de se connecter à la db"));
initDB();

app.get("/", (req, res) => {
    res.send("API REST of a virtual library !");
    GetEpubFile();
});

app.get("/api/", (req, res) => {
  res.redirect(`http://localhost:${port}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

app.use("/api/users", customerRouter);
app.use("/api/login",loginRouter);
app.use("/api/books", booksRouter);
app.use("/api/categories", categorysRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/authors", authorRouter);

app.use(({res}) => {
  const message = "Impossible de trouver la ressource demandée ! Veuillez essayer une autre URL";
  res.status(404).json(message);
});