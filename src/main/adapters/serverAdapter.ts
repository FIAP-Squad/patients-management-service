import { type IMiddleware } from '@/infrastructure'
import { type NextFunction, type Request, type Response } from 'express'

export const adaptServer = (middleware: IMiddleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      headers: req.headers || {}
    }
    const response = await middleware.handle(request)
    if (response.statusCode === 200) {
      Object.assign(req, response.body)
      next()
    } else {
      res.status(response.statusCode).json({
        error: response.body.message
      })
    }
  }
}
