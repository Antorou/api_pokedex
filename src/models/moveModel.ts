import { connectionDB } from "../db/connectionDB";
import logger from "../logger";
import { Move } from "../types/move";

export async function findAllMoves(): Promise<Move[]> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute("SELECT * FROM moves");
    return rows as Move[];
  } catch (err) {
    logger.error("Erreur dans findAllMoves:", err);
    throw err;
  }
}

export async function findMoveById(id: number): Promise<Move | null> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute("SELECT * FROM moves WHERE id = ?", [id]);

    const results = rows as Move[];
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    logger.error(`Erreur dans findMoveById(${id}):`, err);
    throw err;
  }
}

export async function insertMove(moveData: Omit<Move, "id">): Promise<Move> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute(
      `INSERT INTO moves (
        identifier,
        generation_id,
        type_id,
        power,
        pp,
        accuracy,
        priority,
        target_id,
        damage_class_id,
        effect_id,
        effect_chance,
        contest_type_id,
        contest_effect_id,
        super_contest_effect_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        moveData.identifier,
        moveData.generation_id,
        moveData.type_id,
        moveData.power,               // Can be null
        moveData.pp,                  // Can be null
        moveData.accuracy,            // Can be null
        moveData.priority,
        moveData.target_id,
        moveData.damage_class_id,
        moveData.effect_id,
        moveData.effect_chance,       // Can be null
        moveData.contest_type_id,     // Can be null
        moveData.contest_effect_id,   // Can be null
        moveData.super_contest_effect_id // Can be null
      ]
    );

    const insertedId = result.insertId;
    return { id: insertedId, ...moveData };
  } catch (err) {
    logger.error("Erreur dans insertMove:", err);
    throw err;
  }
}

export async function updateMoveInDB(id: number, moveData: Omit<Move, "id">): Promise<boolean> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute(
      `UPDATE moves SET identifier = ?, generation_id = ?, type_id = ?, power = ?, pp = ?, accuracy = ?, priority = ?, target_id = ?, damage_class_id = ?, effect_id = ?, effect_chance = ?, contest_type_id = ?, contest_effect_id = ?, super_contest_effect_id = ? WHERE id = ?`,
      [
        moveData.identifier, moveData.generation_id, moveData.type_id, moveData.power, moveData.pp,
        moveData.accuracy, moveData.priority, moveData.target_id, moveData.damage_class_id, moveData.effect_id,
        moveData.effect_chance, moveData.contest_type_id, moveData.contest_effect_id, moveData.super_contest_effect_id, id
      ]
    );

    return result.affectedRows > 0;
  } catch (err) {
    logger.error(`Erreur dans updateMoveInDB(${id}):`, err);
    throw err;
  }
}

export async function deleteMoveFromDB(id: number): Promise<boolean> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute(
      "DELETE FROM moves WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  } catch (err) {
    logger.error(`Erreur dans deleteMoveFromDB(${id}):`, err);
    throw err;
  }
}
