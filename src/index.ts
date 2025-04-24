import express from "express";
import logger from "./logger";
import { connectionDB } from "./db/connectionDB";
import pokemonsRoutes from "./routes/pokemons";
import movesRoutes from "./routes/moves";
import typesRoutes from "./routes/types";
import itemsRoutes from "./routes/items";
import usersRoutes from "./routes/users"

const app = express();
const PORT = 8080;

app.use(express.json());


app.use("/api/pokemons", pokemonsRoutes);

app.use("/api/moves", movesRoutes);

app.use("/api/types", typesRoutes);

app.use("/api/items", itemsRoutes);

app.use("/api/users", usersRoutes)

app.listen(PORT, async () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
  try {
    await connectionDB();
  } catch (err) {
    logger.error("Connexion DB échouée");
  }
});
