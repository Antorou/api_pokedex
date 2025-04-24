import { Request, Response, RequestHandler } from "express";
import { findAllTypes, 
  findTypeById, 
  insertType, 
  updateTypeInDB,
  deleteTypeFromDB
} from "../models/typeModel";
import logger from "../logger";

export async function getAllTypes(req: Request, res: Response) {
    try {
      const types = await findAllTypes();
      res.status(200).json(types);
    } catch (err) {
      logger.error("Erreur lors de la récupération des Types :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

export const getTypeById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  try {
    const type = await findTypeById(id);
    if (!type) {
      res.status(404).json({ error: "Type introuvable" });
      return;
    }

    res.status(200).json(type);
  } catch (err) {
    console.error("Erreur lors de la récupération du type:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createType: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { identifier, generation_id, damage_class_id } = req.body;

  if (!identifier || !generation_id || !damage_class_id) {
    res.status(400).json({ error: "Champs manquants ou invalides" });
    return;
  }

  try {
    const newType = await insertType({ identifier, generation_id, damage_class_id });
    res.status(201).json(newType);
    logger.info(`Type créé : ${identifier} (generation_id: ${generation_id}, damage_class_id: ${damage_class_id})`);
  } catch (err) {
    logger.error("Erreur lors de la création du type :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateType: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { identifier, generation_id, damage_class_id } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  if (!identifier || !generation_id || !damage_class_id) {
    res.status(400).json({ error: "Champs manquants ou invalides" });
    return;
  }

  try {
    const updated = await updateTypeInDB(id, { identifier, generation_id, damage_class_id });

    if (!updated) {
      res.status(404).json({ error: "Type non trouvé" });
      return;
    }

    res.status(200).json({ id, identifier, generation_id, damage_class_id });
    logger.info(`Type mis à jour (id: ${id})`);
  } catch (err) {
    logger.error("Erreur lors de la mise à jour du type :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteType: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  try {
    const deleted = await deleteTypeFromDB(id);

    if (!deleted) {
      res.status(404).json({ error: "Type non trouvé" });
      return;
    }

    res.status(204).send();
    logger.info(`Type supprimé (id: ${id})`);
  } catch (err) {
    logger.error("Erreur lors de la suppression du type :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

