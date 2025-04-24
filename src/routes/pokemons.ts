import { Router } from "express";
import { getAllPokemons, 
    getPokemonById, 
    getPokemonTypes, 
    getPokemonMoves, 
    getPokemonEggGroups 
} from "../controllers/pokemonsController";
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get("/", authenticateToken, getAllPokemons);

router.get("/:id", authenticateToken, getPokemonById);

router.get("/:id/types", authenticateToken, getPokemonTypes);

router.get("/:id/moves", authenticateToken, getPokemonMoves);

router.get("/:id/egg-groups", authenticateToken, getPokemonEggGroups);


export default router;
