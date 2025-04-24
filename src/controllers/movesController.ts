import { Request, Response, RequestHandler } from "express";
import { findAllMoves, 
  findMoveById, 
  insertMove, 
  updateMoveInDB,
  deleteMoveFromDB
} from "../models/moveModel";
import logger from "../logger";

export async function getAllMoves(req: Request, res: Response) {
  try {
    const moves = await findAllMoves();
    res.json(moves);
  } catch (err) {
    logger.error("Erreur lors de la récupération des moves :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export const getMoveById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  try {
    const move = await findMoveById(id);
    if (!move) {
      res.status(404).json({ error: "Move introuvable" });
      return;
    }

    res.json(move);
  } catch (err) {
    console.error("Erreur lors de la récupération du move:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createMove: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const {
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
  } = req.body;

  if (
    !identifier ||
    generation_id == null ||
    type_id == null ||
    power == null ||
    pp == null ||
    accuracy == null ||
    priority == null ||
    target_id == null ||
    damage_class_id == null ||
    effect_id == null ||
    effect_chance == null ||
    contest_type_id == null ||
    contest_effect_id == null ||
    super_contest_effect_id == null
  ) {
    res.status(400).json({ error: "Champs manquants ou invalides" });
    return;
  }

  try {
    const newMove = await insertMove({
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
    });

    res.status(201).json(newMove);
    logger.info(`Move créé : ${identifier}`);
  } catch (err) {
    logger.error("Erreur lors de la création du move :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateMove: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const {
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
  } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  if (
    !identifier ||
    generation_id == null ||
    type_id == null ||
    power == null ||
    pp == null ||
    accuracy == null ||
    priority == null ||
    target_id == null ||
    damage_class_id == null ||
    effect_id == null ||
    effect_chance == null ||
    contest_type_id == null ||
    contest_effect_id == null ||
    super_contest_effect_id == null
  ) {
    res.status(400).json({ error: "Champs manquants ou invalides" });
    return;
  }

  try {
    const existingMove = await findMoveById(id);
    if (!existingMove) {
      res.status(404).json({ error: "Move non trouvé" });
      return;
    }

    const updated = await updateMoveInDB(id, {
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
    });

    if (!updated) {
      res.status(404).json({ error: "Erreur lors de la mise à jour du Move" });
      return;
    }

    res.status(200).json({
      id,
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
    });
    logger.info(`Move mis à jour (id: ${id})`);
  } catch (err) {
    logger.error("Erreur lors de la mise à jour du move :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteMove: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  try {
    const deleted = await deleteMoveFromDB(id);

    if (!deleted) {
      res.status(404).json({ error: "Move non trouvé" });
      return;
    }

    res.status(204).send();
    logger.info(`Move supprimé (id: ${id})`);
  } catch (err) {
    logger.error("Erreur lors de la suppression du move :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
