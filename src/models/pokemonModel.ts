import { connectionDB } from "../db/connectionDB";
import logger from "../logger";
import { Pokemon } from "../types/pokemon";
import { Type } from "../types/type";
import { Move } from "../types/move";
import { EggGroup } from "../types/eggGroup";


export async function findAllPokemons(): Promise<Pokemon[]> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute("SELECT * FROM pokemon");
    return rows as Pokemon[];
  } catch (err) {
    logger.error("Erreur dans findAllPokemons:", err);
    throw err;
  }
}

export async function findPokemonById(id: number): Promise<Pokemon | null> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute("SELECT * FROM pokemon WHERE id = ?", [id]);

    const results = rows as Pokemon[];
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    logger.error(`Erreur dans findPokemonById(${id}):`, err);
    throw err;
  }
}

export async function findPokemonTypes(pokemonId: number): Promise<Type[]> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute(
      `SELECT t.id, t.identifier 
       FROM pokemon_types pt 
       JOIN types t ON pt.type_id = t.id 
       WHERE pt.pokemon_id = ?`, 
      [pokemonId]
    );
    
    return rows as Type[];
  } catch (err) {
    logger.error(`Erreur dans findPokemonTypes(${pokemonId}):`, err);
    throw err;
  }
}

export async function findPokemonMoves(pokemonId: number): Promise<Move[]> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute(
      `SELECT moves.id, moves.identifier
       FROM pokemon_moves
       JOIN moves ON pokemon_moves.move_id = moves.id
       WHERE pokemon_moves.pokemon_id = ?`,
      [pokemonId]
    );

    return rows as Move[];
  } catch (err) {
    logger.error(`Erreur dans findPokemonMoves(${pokemonId}):`, err);
    throw err;
  }
}

export async function findPokemonEggGroups(pokemonId: number): Promise<{ TypeOeuf: string }[]> {
  try {
    const connection = await connectionDB();
    const [rows] = await connection.execute(
      `SELECT eg.identifier
       FROM pokemon p
       JOIN pokemon_egg_groups peg ON p.species_id = peg.species_id
       JOIN egg_groups eg ON peg.egg_group_id = eg.id
       WHERE p.id = ?`,
      [pokemonId]
    );

    return rows as { TypeOeuf: string }[];
  } catch (err) {
    logger.error(`Erreur dans findPokemonEggGroups(${pokemonId}):`, err);
    throw err;
  }
}