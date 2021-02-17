import UserModel from "../models/user.model";

export class UserService {

    async getByEmail(email: string) {
        const user = await  UserModel.findOne({
            email
        }).exec();
        return user;
    }
}