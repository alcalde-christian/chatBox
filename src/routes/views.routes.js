import { Router } from "express"

const router = Router()

// Rutas de Handlebars
router.get("/", async (req, res) => {
    res.render("messages", {})
})

export default router