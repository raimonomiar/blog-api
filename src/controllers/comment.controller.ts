import { Request, Response, NextFunction, Router, request } from "express";
import { IController } from "../shared/interfaces";
import { CommentService } from "../services";
export class CommentController implements IController {

    public router: Router;
    public route: string = 'comments';

    constructor(private commentService: CommentService) {
        this.router = Router();
        this.initRoutes();

    }

    initRoutes() {
        this.router.get("/", this.getWithPagination);
        this.router.post("/", this.create);
        this.router.put("/:commentId", this.update);
        this.router.patch("/:commentId", this.hideComment);
        this.router.delete("/:commentId", this.delete);
    }

    getWithPagination = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const postId = request.params.postId;
            if (postId === undefined || postId === "") {
                return response.status(404).send({ message: "Identifier not found" });
            }

            const comments = this.commentService.getComments(request.query, postId);
            response.json(comments);
        } catch (error) {
            next(error);
        }
    }

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const postId = request.params.postId;
            if (postId === undefined || postId === "") {
                return response.status(404).send({ message: "Identifier not found" });
            }

            await this.commentService.add(request.body, postId);
            response.status(201).send();
        } catch (error) {
            next(error);
        }
    }

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const postId = request.params.postId;
            if (postId === undefined || postId === "") {
                return response.status(404).send({ message: "Identifier not found" });
            }

            const comment = await this.commentService.getById(request.params.categoryId);

            if (comment === undefined || comment === null) {
                global.logger.log({
                    level: "info",
                    message: `Update comment - ${request.params.categoryId} doesnt exists`
                })
                return response.status(404).send({ message: "Identifier not found" });
            }

            await this.commentService.update(comment.getDataValue("commentId"), request.body);
            response.status(204).send();

        } catch (error) {
            next(error);
        }
    }

    hideComment = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const postId = request.params.postId;
            if (postId === undefined || postId === "") {
                return response.status(404).send({ message: "Identifier not found" });
            }

            const comment = await this.commentService.getById(request.params.categoryId);
            if (comment === undefined || comment === null) {
                global.logger.log({
                    level: "info",
                    message: `Update comment - ${request.params.categoryId} doesnt exists`
                })
                return response.status(404).send({ message: "Identifier not found" });
            }

            await this.commentService.hide(comment.getDataValue("commentId"));
            response.status(204).send();

        } catch (error) {
            next(error);
        }
    }

    delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const postId = request.params.postId;
            if (postId === undefined || postId === "") {
                return response.status(404).send({ message: "Identifier not found" });
            }

            const comment = await this.commentService.getById(request.params.categoryId);
            if (comment === undefined || comment === null) {
                global.logger.log({
                    level: "info",
                    message: `Update comment - ${request.params.categoryId} doesnt exists`
                })
                return response.status(404).send({ message: "Identifier not found" });
            }

            await this.commentService.delete(comment.getDataValue("commentId"));

        } catch (error) {
            next(error);
        }
    }
}