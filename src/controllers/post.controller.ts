import { IController } from "src/shared/interfaces";
import { Router, Request, Response, NextFunction } from "express";
import { PostService } from "src/services";
import { authMiddleware } from "src/middlewares";

export class PostController implements IController {

    public router: Router;
    public route: string = "posts";

    constructor(private postService: PostService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", [authMiddleware], this.getWithPagination);
    }

    getWithPagination = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { userId } = response.locals.User;
            const posts = await this.postService.getPosts(request.query, userId);

            response.json(posts);
        } catch (error) {
            next(error);
        }
    }
}