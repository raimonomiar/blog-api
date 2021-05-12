import { ParsedQs } from "qs";
import { getPagination, getSorting } from "../shared/extensions";
import { Category } from "../models";

export class CategoryService {

    async getCategories(query: ParsedQs) {
        const { name, page, size, order, orderBy } = query;

        const categories = await Category.findAll({
            attributes: [['guid', 'categoryId'], 'name'],
            where: { datedeleted: null, name: name },
            ...getPagination({ page, size }),
            ...getSorting({ order, orderBy })
        });

        const totalItems = await Category.count({ where: { datedeleted: null, name: name } });
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
}