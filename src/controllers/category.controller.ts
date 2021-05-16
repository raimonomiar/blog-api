import { Router, Request, Response, NextFunction, request } from "express";
import { validateCategory } from "src/request_validations";
import { CategoryService } from "src/services/category.service";
import { IController } from "src/shared/interfaces";
import { authMiddleware } from "../middlewares";
export class CategoryController implements IController {

    public router: Router;
    public route: string = 'categories';

    constructor(private categoryService: CategoryService) {
        this.router = Router();
        this.initRoutes();

    }

    initRoutes() {
        this.router.get("/", [authMiddleware], this.getWithPagination);
        this.router.post("/", [authMiddleware, validateCategory], this.create);
    }

    getWithPagination = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const categories = await this.categoryService.getCategories(request.query);

            response.json(categories);

        } catch (error) {
            next(error);
        }
    }

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.categoryService.add(request.body);
            response.status(201).send();
        } catch (error) {
            next(error);
        }
    }
}