import { UserModel } from "../models/user.model";

export class UserService {

    getByEmail(email: string) {
        return UserModel.findOne({
            email
        });
    }
}