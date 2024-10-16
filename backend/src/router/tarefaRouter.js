import { Router } from "express"
import { getAll, create, getTarefa, updateTarefa, updateStatusTarefa, getTarefaStatus, deleteTarefa } from "../controller/tarefaController.js"

const router = Router()

router.get("/", getAll)
router.post("/", create)
router.get("/:id", getTarefa)
router.put("/:id", updateTarefa)
router.patch("/:id/status", updateStatusTarefa)
router.get("/status/:situacao", getTarefaStatus)
router.delete("/:id", deleteTarefa)

export default router