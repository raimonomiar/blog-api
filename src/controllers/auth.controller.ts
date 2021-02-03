import { IController } from "../shared/interfaces";
import { Router, Request, Response, NextFunction } from "express";
import { validateAuth } from "../request_validations/user.validation";
import { UserService } from "src/services";

export class AuthController implements IController {

    public router: Router;
    public route: string = 'auth';

    constructor(private userService: UserService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/", validateAuth, this.authenticate);
    }


    authenticate = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { email, password } = request.body;
            const user = this.userService.getByEmail(email);
            console.log(user);
        } catch (error) {
            next(error);
        }
    }
}