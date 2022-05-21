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
  runmasters: require("./src/routes/runmasters"),
  aboutus: require("./src/routes/aboutus"),
  doc: require("./src/routes/doc"),
  ourpeople: require("./src/routes/ourpeople"),
  history: require("./src/routes/history"),
  rum: require("./src/routes/rum"),
};

app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use("/rdv-services/home", routes.home);
app.use("/rdv-services/", routes.contenido);
app.use("/rdv-services/users", routes.users);
app.use("/rdv-services/", routes.noticias);
app.use("/rdv-services/", routes.empresas);
app.use("/rdv-services/runmasters", routes.runmasters);
app.use("/rdv-services/aboutus", routes.aboutus);
app.use("/rdv-services/doc", routes.doc);
app.use("/rdv-services/our-people", routes.ourpeople);
app.use("/rdv-services/history", routes.history);
app.use("/rdv-services/rum", routes.rum);

// TEST SERVER
const today = new Date();
app.get("/rdv-api-services", (req, res) => {
  res.json({
    codigo: "1",
    message: process.env.PORT + " rdv-api-services it´s ok. TODAY: " + today,
  });
});
app.get("/rdv-api-services/prueba", (req, res) => {
  res.json({
    codigo: "1",
    message: process.env.PORT + " rdv-api-services/prueba it´s ok",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server " + process.env.PORT);
});
