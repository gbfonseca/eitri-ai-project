import { Vtex } from 'eitri-shopping-vtex-shared'

export const getProductsByFacets = async (facets, options) => {
    return await Vtex.catalog.getProductsByFacets(facets, options)
}