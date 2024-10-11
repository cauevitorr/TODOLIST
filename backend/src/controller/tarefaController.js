import Tarefa from "../models/tarefaModel.js"
import { z } from "zod"

const createSchema = z.object({
    tarefa: z.string({
        invalid_type_error: "A tarefa deve ser um texto",
        required_error: "A tarefa é obrigatória"
    })
        .min(3, { message: "A terefa dever conter pelo menos 3 caracteres" })
        .max(255, { message: "A tarefa não deve execer 255 caracteres" }),
    descricao:
        z.string()
            .min(5, { messge: "A descrição deve conter no mínimo 5 caracteres" })
            .nullable(),
})

export const create = async (request, response) => {
    const createValidation = createSchema.safeParse(request.body)
    if (!createValidation.success) {
        response.status(400).json(createValidation.error)
        return
    }

    const { tarefa, descricao } = createValidation.data

    const novaTarefa = {
        tarefa,
        descricao
    }

    try {
        const tarefaAdd = Tarefa.create(novaTarefa)
        response.status(201).json(tarefaAdd)
    } catch (error) {
        console.error(error)
        response.status(500).json({ err: "Erro ao cadastrar tarefa" })
    }

}
export const getAll = async (request, response) => {
    try {
        const tarefas = await Tarefa.findAll()
        response.status(200).json(tarefas)
    } catch (error) {
        console.error(error)
        response.status(500).json({ err: "Erro ao buscar a tarefas" })
    }
}
export const getTarefa = (request, response) => {
    response.status(200).json("getTarefa")
}
export const updateTarefa = (request, response) => {
    response.status(200).json("updateTarefa")
}
export const updateStatusTarefa = (request, response) => {
    response.status(200).json("updateStatusTarefa")
}
export const getTarefaStatus = (request, response) => {
    response.status(200).json("getTarefaStatus")
}

