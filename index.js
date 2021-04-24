const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const routes = {
  contenido: require("./src/routes/contenido"),
  home: require("./src/routes/home"),
  users: require("./src/routes/users"),
};

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/services-rdv/home", routes.home);
app.use("/services-rdv/", routes.contenido);
app.use("/services-rdv/users", routes.users);

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server " + process.env.SERVER_PORT);
});
