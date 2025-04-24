import { Router } from "express";
import { getAllMoves, getMoveById, createMove, updateMove, deleteMove } from "../controllers/movesController";

const router = Router();

router.get("/", getAllMoves);
router.get("/:id", getMoveById);

router.post("/", createMove); 

router.put("/:id", updateMove);

router.delete("/:id", deleteMove);
export default router;