import {apiSlice} from "./apiSlice"

const apiRajaOngkir = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllProvinces: builder.query({
            query: () => {
                return { 
                    url: "ongkir/get-provinces",
                    method: "GET",
                }
            }
        }),
        findAllCityByProvinces: builder.query({
            query: ({ provId }) => {
                return { 
                    url: "ongkir/get-city/"+provId,
                    method: "GET",
                }
            }
        }),
        calculateShippingCost: builder.mutation({
            query: ({ data }) => {
                return { 
                    url: "ongkir/calculate-shipping-cost",
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            }
        }),
    })
})

export const {
    useFindAllProvincesQuery,
    useFindAllCityByProvincesQuery,
    useCalculateShippingCostMutation,
} = apiRajaOngkir