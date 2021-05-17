import { ParsedQs } from "qs";
import { Post, User } from "../models";
import { Op } from "sequelize";
import { getPagination, getSorting } from "src/shared/extensions";
export class PostService {

    async getPosts(query: ParsedQs, userId: string) {
        const { title, page, size, order, orderBy } = query;

        const user = await User.findOne({
            attributes: ['userid'],
            where: { deletedat: null, guid: userId }
        });

        const posts = await Post.findAll({
            attributes: [["guid", "postId"], "title", ["ispublished", "isPublished"], "content", ["createdat", "createdAt"]],
            include: [{
                association: "author",
                attributes: [["guid", "userId"], "name", "email"]
            }, {
                association: "category",
                attributes: [["guid", "categoryId"], "name"]
            }],
            where: {
                deletedat: null,
                userid: user.getDataValue("userid"),
                '$author$.deletedat': null,
                '$category$.deletedat': null,
                ...(title !== undefined ? {
                    title: { [Op.iLike]: `%${title}%` }
                } : {})
            },
            ...getPagination({ page, size }),
            ...getSorting({ order, orderBy })
        });

        const totalItems = await Post.count({
            where: {
                deletedat: null,
                userid: user.getDataValue("userid"),
                ...(title !== undefined ? { title: title } : {})
            }
        });
        const totalPages = Math.ceil(totalItems / Number(size));

        return {
            data: posts,
            meta: {
                page,
                size,
                totalItems,
                totalPages
            }
        }
    }
}