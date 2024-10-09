import Tarefa from "../models/tarefaModel.js"
import { z } from "zod"

export const create = (request, response)=>{
    response.status(200).json("chegou no controlador")
}