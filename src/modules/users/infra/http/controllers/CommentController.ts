import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateCommentService from '@modules/users/services/CreateCommentService'
import IndexCommentService from '@modules/users/services/IndexCommentService'
import { classToClass } from 'class-transformer'
import ShowCommentService from '@modules/users/services/ShowCommentService'
import DeleteCommentService from '@modules/users/services/DeleteCommentService'

export default class CommentController {
  public async create(req: Request, res: Response): Promise<Response> {
    const create = container.resolve(CreateCommentService)

    const response = await create.execute(req.body, req.user.id)

    return res.json(response)
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { commentId } = req.params

    const show = container.resolve(ShowCommentService)

    const result = await show.execute(commentId)

    return res.json(result)
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { commentId } = req.params

    const deleted = container.resolve(DeleteCommentService)

    await deleted.execute(commentId)

    return res.status(204).send()
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 999999, userId = '' } = request.query

    const index = container.resolve(IndexCommentService)

    const result = await index.execute(
      {
        page: Number(page),
        limit: Number(limit),
      },
      String(userId),
    )

    return response.json(classToClass(result))
  }
}
