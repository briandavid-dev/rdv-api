const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const routes = {
  contenido: require("./src/routes/contenido"),
  home: require("./src/routes/home"),
  users: require("./src/routes/users"),
  noticias: require("./src/routes/noticias"),
  empresas: require("./src/routes/empresas"),
};

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/services-rdv/home", routes.home);
app.use("/services-rdv/", routes.contenido);
app.use("/services-rdv/users", routes.users);
app.use("/services-rdv/", routes.noticias);
app.use("/services-rdv/", routes.empresas);

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server " + process.env.SERVER_PORT);
});

const a = [{ a: 1 }, { b: 22 }];
const b = [{ a: 1 }, { b: 2 }];

console.log(`compare`, a === b);
console.log(`compare`, JSON.stringify(a) === JSON.stringify(b));
