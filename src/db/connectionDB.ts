import mysql from "mysql2/promise";
import logger from "../logger";
import { dbConfig } from "../config";

export async function connectionDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    logger.info("Connexion réussie à la base de données MySQL");
  
    // const [results] = await connection.execute(
    //     "SELECT identifier FROM pokemon WHERE id < ?",
    //     [2]
    //   );

    // logger.info(`Résultats de la requête : ${JSON.stringify(results)}`);
    return connection;
  } catch (err) {
    logger.error(`Erreur de connexion DB : ${err}`);
    throw err;
  }
}