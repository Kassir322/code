import { api } from '../api'

export const productsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		// Получение списка всех продуктов
		getProducts: builder.query({
			query: (params = {}) => ({
				url: '/api/study-cards',
				params: { ...params, populate: '*' },
			}),
			transformResponse: (response) => response.data,
			providesTags: ['Products'],
		}),

		// Получение продуктов по категории
		getProductsByCategory: builder.query({
			query: (categorySlug) => ({
				url: '/api/study-cards',
				params: {
					'filters[category][slug][$eq]': categorySlug,
					populate: '*',
				},
			}),
			transformResponse: (response) => response.data,
			providesTags: ['Products'],
		}),

		// Получение продукта по ID
		getProductById: builder.query({
			query: (id) => ({
				url: `/api/study-cards/${id}`,
				params: { populate: '*' },
			}),
			transformResponse: (response) => response.data,
			providesTags: (result, error, id) => [{ type: 'Products', id }],
		}),

		// Получение категорий
		getCategories: builder.query({
			query: () => ({
				url: '/api/categories',
				params: { populate: '*' },
			}),
			transformResponse: (response) => response.data,
			providesTags: ['Categories'],
		}),
	}),
})

export const {
	useGetProductsQuery,
	useGetProductsByCategoryQuery,
	useGetProductByIdQuery,
	useGetCategoriesQuery,
} = productsApi
