import { Request, Response, RequestHandler} from "express";
import { findAllItems, findItemById, insertItem, updateItemInDB, deleteItemFromDB } from "../models/itemModel";
import logger from "../logger";

export async function getAllItems(req: Request, res: Response) {
    try {
      const items = await findAllItems();
      res.json(items);
    } catch (err) {
      logger.error("Erreur lors de la récupération des Items :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

export const getItemById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  try {
    const Item = await findItemById(id);
    if (!Item) {
      res.status(404).json({ error: "Item introuvable" });
      return;
    }

    res.json(Item);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'item:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { identifier, category_id, cost, fling_power, fling_effect_id } = req.body;

  if (!identifier || category_id == null || cost == null) {
    res.status(400).json({ error: "Champs obligatoires manquants ou invalides" });
    return;
  }

  try {
    const newItem = await insertItem({ identifier, category_id, cost, fling_power, fling_effect_id });
    res.status(201).json(newItem);
    logger.info(`Item créé : ${identifier}`);
  } catch (err) {
    logger.error("Erreur lors de la création de l'item :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { identifier, category_id, cost, fling_power, fling_effect_id } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  if (!identifier || category_id == null || cost == null) {
    res.status(400).json({ error: "Champs obligatoires manquants ou invalides" });
    return;
  }

  try {
    const item = await findItemById(id);
    if (!item) {
      res.status(404).json({ error: "Item non trouvé" });
      return;
    }

    const updated = await updateItemInDB(id, { identifier, category_id, cost, fling_power, fling_effect_id });
    if (!updated) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'item" });
      return;
    }

    res.status(200).json({ id, identifier, category_id, cost, fling_power, fling_effect_id });
    logger.info(`Item mis à jour (id: ${id})`);
  } catch (err) {
    logger.error("Erreur lors de la mise à jour de l'item :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  try {
    const deleted = await deleteItemFromDB(id);

    if (!deleted) {
      res.status(404).json({ error: "Item non trouvé" });
      return;
    }

    res.status(204).send();
    logger.info(`Item supprimé (id: ${id})`);
  } catch (err) {
    logger.error("Erreur lors de la suppression de l'item :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};