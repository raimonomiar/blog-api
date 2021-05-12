import { Router, Request, Response, NextFunction } from "express";
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
    }

    getWithPagination = async (request: Request, response: Response, next: NextFunction)  => {
        try {
            const categories = this.categoryService.getCategories(request.query);

            response.json(categories);

        } catch (error) {
            next(error);
        }
    }
}