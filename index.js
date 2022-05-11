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
};

app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use("/rdv-api-services/home", routes.home);
app.use("/rdv-api-services/", routes.contenido);
app.use("/rdv-api-services/users", routes.users);
app.use("/rdv-api-services/", routes.noticias);
app.use("/rdv-api-services/", routes.empresas);
app.use("/rdv-api-services/runmasters", routes.runmasters);
app.use("/rdv-api-services/aboutus", routes.aboutus);
app.use("/rdv-api-services/doc", routes.doc);

// TEST SERVER
app.get("/rdv-api-services", (req, res) => {
  res.json({
    codigo: "1",
    message: process.env.PORT + " rdv-api-services it´s ok",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server " + process.env.PORT);
});
