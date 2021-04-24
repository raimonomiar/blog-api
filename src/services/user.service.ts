import { User } from "../models";

export class UserService {

    async getByEmail(email: string) {
        const user = await  User.findOne({
            where: {
                datedeleted: null,
                email: email
            }
        });
        return user;
    }
}