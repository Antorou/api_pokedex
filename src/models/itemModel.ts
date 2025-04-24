import { connectionDB } from "../db/connectionDB";
import logger from "../logger";
import { Item } from "../types/item";

export async function findAllItems(): Promise<Item[]> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute("SELECT * FROM items");
    return rows as Item[];
  } catch (err) {
    logger.error("Erreur dans findAllItems:", err);
    throw err;
  }
}

export async function findItemById(id: number): Promise<Item | null> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute("SELECT * FROM items WHERE id = ?", [id]);

    const results = rows as Item[];
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    logger.error(`Erreur dans findItemById(${id}):`, err);
    throw err;
  }
}

export async function insertItem(itemData: Omit<Item, "id">): Promise<Item> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute(
      `INSERT INTO items 
      (identifier, category_id, cost, fling_power, fling_effect_id) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        itemData.identifier,
        itemData.category_id,
        itemData.cost,
        itemData.fling_power,
        itemData.fling_effect_id
      ]
    );

    const id = result.insertId;
    return { id, ...itemData };
  } catch (err) {
    logger.error("Erreur dans insertItem :", err);
    throw err;
  }
}

export async function updateItemInDB(id: number, itemData: Omit<Item, "id">): Promise<boolean> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute(
      `UPDATE items SET 
      identifier = ?, category_id = ?, cost = ?, 
      fling_power = ?, fling_effect_id = ?
      WHERE id = ?`,
      [
        itemData.identifier,
        itemData.category_id,
        itemData.cost,
        itemData.fling_power,
        itemData.fling_effect_id,
        id
      ]
    );

    return result.affectedRows > 0;
  } catch (err) {
    logger.error(`Erreur dans updateItemInDB(${id}) :`, err);
    throw err;
  }
}

export async function deleteItemFromDB(id: number): Promise<boolean> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute("DELETE FROM items WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (err) {
    logger.error(`Erreur dans deleteItemFromDB(${id}) :`, err);
    throw err;
  }
}
