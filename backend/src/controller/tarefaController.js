import Tarefa from "../models/tarefaModel.js"
import { z } from "zod"

//validações
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
const idSchema = z.object({
    id: z.string().uuid({ message: 'ID inválido.' })
})
const updateSchema = z.object({
    tarefa: z.string().min(3, { message: "A tarefa deve conter no mínimo 3 caracteres." }).max(255, { message: "A tarefa deve conter no máximo 255 caracteres." }),
    status: z.enum(["pendente", "concluida"])
})
const situacaoSchema = z.object({
    situacao: z.enum(["pendente", "concluida"])
})

//controladores
export const create = async (request, response) => {
    const createValidation = createSchema.safeParse(request.body)
    if (!createValidation.success) {
        response.status(400).json(createValidation.error)
        return
    }

    const { tarefa } = createValidation.data
    const descricao = request.body?.descricao || null

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
    //GET -> 3333/api/tarefas?pages=1&limit=10

    const page = parseInt(request.query.page) || 1
    const limit = parseInt(request.query.limit) || 10
    const offset = (page - 1) * 10

    try {
        const tarefas = await Tarefa.findAndCountAll({
            limit,
            offset,
        })

        const totalPaginas = Math.ceil(tarefas.count / limit)

        response.status(200).json({
            totalTarefas: tarefas.count,
            totalPaginas,
            paginaAtual: page,
            intensPorPagina: limit,
            proximaPagina: totalPaginas === 0 ? null : `http://localhost:3333/api/tarefas/page= ${page + 1}`,
            tarefas: tarefas.rows
        })
    } catch (error) {
        console.error(error)
        response.status(500).json({ err: "Erro ao buscar a tarefas" })
    }
}
export const getTarefa = async (request, response) => {
    const idValidation = idSchema.safeParse(request.params)
    if (!idValidation.success) {
        response.status(400).json({ message: idValidation.error })
        return
    }

    const id = idValidation.data.id

    try {
        const tarefa = await Tarefa.findByPk(id)
        if (!tarefa) {
            response.status(404).json({ err: "Tarefa não encontrada" })
            return
        }
        response.status(200).json(tarefa)
    } catch (error) {
        console.error(error)
        response.status(500).json({ err: "Erro ao buscar tarefa" })
    }

}
export const updateTarefa = async (request, response) => {
    const idValidation = idSchema.safeParse(request.params)
    if (!idValidation.success) {
        response.status(400).json({ message: idValidation.error })
        return
    }

    const id = idValidation.data.id

    const updateValidation = updateSchema.safeParse(request.body)
    if (!updateValidation.success) {
        response.status(400).json({ message: updateValidation.error })
        return
    }

    const { tarefa, status } = updateValidation.data

    const descricao = request.body.descricao || ""

    const tarefaAtualizada = { tarefa, descricao, status }

    try {
        const [numberAffectRow] = await Tarefa.update(tarefaAtualizada, { where: { id } })

        if (numberAffectRow <= 0) {
            response.status(404).json({ err: "Tarefa não encontrada." })
            return
        }
        response.status(500).json({ message: "Tarefa atualizada com sucesso." })
    } catch (error) {
        console.error(error)
        response.status(500).json({ err: "Erro ao atualizar a tarefa." })
    }

}
export const updateStatusTarefa = async (request, response) => {
    const idValidation = idSchema.safeParse(request.params)
    if (!idValidation.success) {
        response.status(400).json({ message: idValidation.error })
        return
    }

    const id = idValidation.data.id

    try {
        const tarefa = await Tarefa.findOne({ raw: true, where: { id } })
        if (!tarefa) {
            response.status(404).json({ err: "YTarefa não encontrada" })
            return
        }

        if (tarefa.status === "pendente") {
            await Tarefa.update({ status: "concluida" }, { where: { id } })
        } else if (tarefa.status === "concluida") {
            await Tarefa.update({ status: 'pendente' }, { where: { id } })
        }
        const tarefaAtulizada = await Tarefa.findByPk(id)
        response.status(200).json(tarefaAtulizada)
    } catch (error) {
        console.error(error)
        response.status(500).json({ err: "Erro ao buscar tarefa" })
    }
}
export const getTarefaStatus = async (request, response) => {
    const situacaoValidation = situacaoSchema.safeParse(request.params)
    if (!situacaoValidation.success) {
        response.status(400).json({ message: situacaoValidation.error })
        return
    }
    const { situacao } = situacaoValidation.data

    try {
        const tarefas = await Tarefa.findAll({ where: { status: situacao } })
        response.status(200).json({ tarefas })
    } catch (error) {
        console.error(error)
        response.status(500).json({ message: "Erro ao buscar tarefas por situação." })
    }
}
export const deleteTarefa = async (request, response) => {
    const idValidation = idSchema.safeParse(request.params)
    if (!idValidation.success) {
        response.status(400).json({ message: idValidation.error })
        return
    }

    const id = idValidation.data.id

    try {
        const tarefaDeletada = await Tarefa.destroy({
            where: { id }
        })
        console.log(tarefaDeletada)

        if (tarefaDeletada === 0) {
            response.status(200).json({ message: "Tarefa não existe" })
            return
        }

        response.status(200).json({ message: "Tarefa excluída." })
    } catch (error) {
        console.error(error)
        response.status(500).json({ message: "Erro ao excluir tarefa." })
    }
}

