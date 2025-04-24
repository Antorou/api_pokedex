import { connectionDB } from "../db/connectionDB";
import logger from "../logger";
import { Type } from "../types/type";

export async function findAllTypes(): Promise<Type[]> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute("SELECT * FROM types");
    return rows as Type[];
  } catch (err) {
    logger.error("Erreur dans findAllTypes:", err);
    throw err;
  }
}

export async function findTypeById(id: number): Promise<Type | null> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute("SELECT * FROM types WHERE id = ?", [id]);

    const results = rows as Type[];
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    logger.error(`Erreur dans findTypeById(${id}):`, err);
    throw err;
  }
}

export async function insertType(typeData: Omit<Type, "id">): Promise<Type> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute(
      "INSERT INTO types (identifier, generation_id, damage_class_id) VALUES (?, ?, ?)",
      [typeData.identifier, typeData.generation_id, typeData.damage_class_id]
    );

    const insertedId = result.insertId;
    return {
      id: insertedId,
      ...typeData,
    };
  } catch (err) {
    logger.error("Erreur dans insertType:", err);
    throw err;
  }
}

export async function updateTypeInDB(id: number, typeData: Omit<Type, "id">): Promise<boolean> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute(
      "UPDATE types SET identifier = ?, generation_id = ?, damage_class_id = ? WHERE id = ?",
      [typeData.identifier, typeData.generation_id, typeData.damage_class_id, id]
    );

    return result.affectedRows > 0;
  } catch (err) {
    logger.error(`Erreur dans updateTypeInDB(${id}):`, err);
    throw err;
  }
}

export async function deleteTypeFromDB(id: number): Promise<boolean> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute("DELETE FROM types WHERE id = ?", [id]);

    return result.affectedRows > 0;
  } catch (err) {
    logger.error(`Erreur dans deleteTypeFromDB(${id}):`, err);
    throw err;
  }
}
