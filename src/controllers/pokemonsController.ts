import { Request, Response, RequestHandler} from "express";
import logger from "../logger";
import { 
  findAllPokemons, 
  findPokemonById, 
  findPokemonTypes, 
  findPokemonMoves, 
  findPokemonEggGroups 
} from "../models/pokemonModel";

export async function getAllPokemons(req: Request, res: Response) {
  try {
    const pokemons = await findAllPokemons();
    res.json(pokemons);
  } catch (err) {
    logger.error("Erreur lors de la récupération des Pokémon :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export const getPokemonById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  try {
    const pokemon = await findPokemonById(id);
    if (!pokemon) {
      res.status(404).json({ error: "Pokémon introuvable" });
      return;
    }

    res.json(pokemon);
    logger.info(`pokemon ${id} found`, id);
  } catch (err) {
    console.error("Erreur lors de la récupération du Pokémon:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export const getPokemonTypes: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  try {
    const types = await findPokemonTypes(id);
    if (!types || types.length === 0) {
      res.status(404).json({ error: "Aucun type trouvé pour ce Pokémon" });
      return;
    }

    res.json(types);
  } catch (err) {
    logger.error(`Erreur lors de la récupération des types du Pokémon (${id}):`, err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export const getPokemonMoves: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  try {
    const moves = await findPokemonMoves(id);
    if (!moves || moves.length === 0) {
      res.status(404).json({ error: "Aucun mouvement trouvé pour ce Pokémon" });
      return;
    }

    res.json(moves);
  } catch (err) {
    logger.error(`Erreur lors de la récupération des mouvements du Pokémon (${id}):`, err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export const getPokemonEggGroups: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  try {
    const eggGroups = await findPokemonEggGroups(id);
    if (!eggGroups || eggGroups.length === 0) {
      res.status(404).json({ error: "Aucun groupe d'œuf trouvé pour ce Pokémon" });
      return;
    }

    res.json(eggGroups);
  } catch (err) {
    logger.error(`Erreur lors de la récupération des groupes d'œufs pour le Pokémon ${id}:`, err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};