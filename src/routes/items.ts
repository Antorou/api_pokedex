import { Router } from "express";
import { getAllItems, getItemById, updateItem, deleteItem, createItem} from "../controllers/itemsController";

const router = Router();

router.get("/", getAllItems);
router.get("/:id", getItemById);

router.post("/", createItem); 

router.put("/:id", updateItem);

router.delete("/:id", deleteItem);


export default router;