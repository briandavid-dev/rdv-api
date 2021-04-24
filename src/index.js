const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

const routes = {
  contenido: require("./routes/contenido"),
  home: require("./routes/home"),
};

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/api-rdv/home", routes.home);
app.use("/api-rdv/", routes.contenido);

app.listen(port, () => {
  console.log("Server " + port);
});
