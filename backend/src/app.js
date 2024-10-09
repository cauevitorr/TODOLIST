import express from "express"
import cors from "cors"
import conn from "./config/conn.js"

import tarefaRouter from "./router/tarefaRouter.js"

const app = express()

// 3 middlewares para a api funcionar corretantemte
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

conn
    .sync()
    .then(() => {
        console.log("Conectado!")
    }).catch((error) => console.error(error))

app.use("/api/tarefas", tarefaRouter)

app.use((request, response) => {
    response.status(404).json({ message: "Rota não encontrada" })
})

export default app