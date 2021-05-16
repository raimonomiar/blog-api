import { ParsedQs } from "qs";
import { getPagination, getSorting } from "../shared/extensions";
import { ICategory } from "../shared/interfaces";
import { Category } from "../models";
import { Op } from "sequelize";
export class CategoryService {

    async getCategories(query: ParsedQs) {
        const { name, page, size, order, orderBy } = query;

        const categories = await Category.findAll({
            attributes: [['guid', 'categoryId'], 'name'],
            where: {
                deletedat: null,
                ...(name !== undefined ? {
                    name: { [Op.iLike]: `%${name}%` }
                } : {})
            },
            ...getPagination({ page, size }),
            ...getSorting({ order, orderBy })
        });

        const totalItems = await Category.count({ where: { deletedat: null, ...(name !== undefined ? { name: name } : {}) } });
        const totalPages = Math.ceil(totalItems / Number(size));

        return {
            data: categories,
            meta: {
                page,
                size,
                totalItems,
                totalPages
            }
        }
    }

    async add(category: ICategory) {
        return await Category.create(category);
    }
}