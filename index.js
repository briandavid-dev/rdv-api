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
app.use(express.json({ limit: "50mb" }));
app.use("/api-services-rdv/home", routes.home);
app.use("/api-services-rdv/", routes.contenido);
app.use("/api-services-rdv/users", routes.users);
app.use("/api-services-rdv/", routes.noticias);
app.use("/api-services-rdv/", routes.empresas);
app.use("/api-services-rdv/runmasters", routes.runmasters);
app.use("/api-services-rdv/aboutus", routes.aboutus);
app.use("/api-services-rdv/doc", routes.doc);

app.listen(process.env.PORT, () => {
  console.log("Server " + process.env.PORT);
});
