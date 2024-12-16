import { apiSlice } from "./apiSlice"

let store
export const injectStoreHome = _store => {
    store = _store
}

const multipelInvalidatesTags = res => {
    return res?.response
        ? res.response.map(id => ({ type: "Episodes", id },{ type: "Episodes",id: "LIST-EPISODES" }))
        : [{ type: "Episodes", id: "LIST-EPISODES" }]
}

const singleInvalidatesTags = res => [{ type: "Episodes", id: res?.response },{ type: "Episodes", id:"LIST-EPISODES" }]

const transformResponseUpdate = el => {
    return {
        
        }
} 

const createRes = (el) => {
    // console.log(el);
    return ({
        title_jp: el?.title_jp,
        index: el?.index_series,
        seri_id: el?.id,
        episodes: el?.Episodes,
        title: el?.title,
        slug: el?.slug,
        status: el?.status,
        type_series: el?.type_series,
        format: el?.format,
        produser: el?.produser,
        studio: el?.studio,
        total_eps: el?.total_eps,
        rating: el?.rating,
        tanggal: el?.tanggal,
        synopsis: el?.synopsis,
        status_series: el?.status_series,
        image: el?.poster,
        image_url: el?.poster_url,
        musim: el?.Season?.namaTahun,
        tayang:  el?.JadwalRili?.namaHari,
        genres:  el?.Genres,
        mengudara: new Date(el?.createdAt).toString().slice(0,15),
        tags: el?.Tags,
    })
}

const transformResponse = type => {
    return res => {
        // console.log(res);
        return (type == "multipel") ? res?.response?.series.map(el=>createRes(el)) : [createRes(res?.response?.series)]
    }
}

const createResEps = el => {
    // console.log("els",el.series.id);
    const streaming = []
    const download = []
    const epsLinkLainya = []
    if(el?.Series && el.Series.length != 0) el.Series?.Episodes.forEach(eps=> {
        epsLinkLainya.push({...eps})
    })
    if(el?.EpisodesLinks && el.EpisodesLinks.length != 0) el.EpisodesLinks.forEach(file => {
        if(file.file_type == "Streaming") streaming.push({...file})
        if(file.file_type == "Download") download.push({...file})
    })
    return { 
        id: el?.id,
        credit: el?.credit_eps,
        fans_sub: el?.fans_sub,
        takarir: el?.takarir,
        url_credit: el?.url_credit,
        index: el?.index_eps, 
        tanggal: el?.Series?.createdAt,
        users: el?.Series?.user.username, 
        title: el?.title, 
        seri_id: el?.Series?.id,
        streaming, 
        download, 
        epsLinkLainya: 
        epsLinkLainya, 
        slugSeri: 
        el?.Series?.slug }
}

const transformResponseEps = type => {
    return  res => {
        // console.log(res);
        return (type == "mutlipel") ? res?.response?.episodes?.map(e=> createResEps(e)) : [createResEps(res?.response?.episodes)]
    }
}

export const apiHomeSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllProductsHome: builder.query({
            query: (params) => {
                const { page, search, perPage } = params
                
                return { 
                    url: "products?search="+search+"&page="+page+"&per_page="+perPage,
                    method: "GET"
                }
            },
            providesTags: result => {
                return result?.response?.products.length > 0
                ? result.response.products.map(p => ({ type: "Products", id: p.id },{ type: "Products",id: "LIST-PRODUCTS" }))
                : [{ type: "Products", id: "LIST-PRODUCTS" }]
            },
        }),
        findAllJadwal: builder.query({
            query: (params) => {
                const { page, search, perPage } = params
                const restore = (store.getState().jadwalRilis.isRestore) ? "restore": ""
                return { 
                    url: "jadwal?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`,
                    method: "GET"
                }
            },
            providesTags: result => {
                return result?.response?.jadwals.length > 0
                ? result.response.jadwals.map(jadwal => ({ type: "JadwalRilis", id: jadwal.id },{ type: "JadwalRilis",id: "LIST-JADWALRILIS" }))
                : [{ type: "JadwalRilis", id: "LIST-JADWALRILIS" }]
            },
        }),
        homeFindOneEpisode: builder.query({
            query: ({ slug }) => {
                return { 
                    url: `episode/${slug}`,
                    method: "GET"
                }
            },
            transformResponse: transformResponseEps("single"),
            providesTags: result => {
                return result.length != 0
                ? result.map(e=> ({ type: "Series", id: e.seri_id },{ type: "Series", id: "LIST-SERIES" }))
                : [{ type: "Series", id: "LIST-SERIES" }]
            }
        }),
        homeFindOneSeries: builder.query({
            query: ({ slug }) => {
                return { 
                    url: `anime/${slug}`,
                    method: "GET"
                }
            },
            transformResponse: transformResponse("single"),
            providesTags: result => {
                return result.length != 0
                ? result.map(e=> ({ type: "Series", id: e.seri_id },{ type: "Series", id: "LIST-SERIES" }))
                : [{ type: "Series", id: "LIST-SERIES" }]
            }
        }),
        homeFindGenres: builder.query({
            query: () => {
                return { 
                    url: `genres`,
                    method: "GET"
                }
            },
            providesTags: result => {
                return result?.response?.genres.length > 0
                ? result.response.genres.map(item => ({ type: "Genres", id: item.id },{ type: "Genres",id: "LIST-GENRES" }))
                : [{ type: "Genres", id: "LIST-GENRES" }]
            },
        }),
        findAnimeByGenres: builder.query({
            query: (params) => {
                const { page, search, perPage,genres } = params
                return { 
                    url: "series-genres?search="+search+"&page="+page+"&per_page="+perPage+`&genres=${genres}`,
                    method: "GET"
                }
            },
            transformResponse: res => {
                const { response,...other1 } = res
                let { series, ...other2 } = response
                series = series.map(e=> ({
                    
                    seri_id: e.id, 
                    seri_title: e.title, 
                    seri_title_jp: e.title_jp, 
                    seri_index: e.seri_index, 
                    seri_slug: e.slug, 
                    seri_image: e.image, 
                    seri_image_url: e.image_url, 
                    seri_synopsis: e.synopsis, 
                    seri_produser: e.produser, 
                    seri_studio: e.studio, 
                    seri_total_eps: e.total_eps, 
                    seri_rating: e.rating, 
                    seri_type: e.type_series, 
                    seri_status: e.status, 
                    seri_format: e.format, 
                    seri_status_series: e.status_series ,  
                    seri_createdAt: e.createdAt, 
                    seri_updateddAt: e.updateddAt, 
                    seri_deletedAt: e.deletedAt,
                }))
                return { ...other1, response: { ...other2, series } }
            },
            providesTags: result => {
                return result?.response?.series.length != 0
                ? result.response.series.map(e=> ({ type: "Series", id: e.seri_id },{ type: "Series", id: "LIST-SERIES" }))
                : [{ type: "Series", id: "LIST-SERIES" }]
            }
       
        }),
        findAnimeOngoing: builder.query({
            query: (params) => {
                const { page, search, perPage, categories } = params
                return { 
                    url: "front/products?search="+search+"&page="+page+"&per_page="+perPage+`&categories=${categories}`,
                    method: "GET",
                    baseUrl: "http://localhost:8000/",
                }
            },
        }),
        findPopularProducts: builder.query({
            query: () => {
                return { 
                    url: "front/popular/products",
                    method: "GET",
                    baseUrl: "http://localhost:8000/",
                }
            },
        }),
        findAnimeComplete: builder.query({
            query: (params) => {
                const { page, search, perPage } = params
                const type = "ongoing"
                return { 
                    url: "products?search="+search+"&page="+page+"&per_page="+perPage+`&type=${type}`,
                    method: "GET"
                }
            },
        }),
    })
})


export const {
    useFindAnimeOngoingQuery,
    useFindAnimeCompleteQuery,
    useHomeFindOneSeriesQuery,
    useHomeFindOneEpisodeQuery,
    useHomeFindGenresQuery,
    useFindAnimeByGenresQuery,
    useFindAllProductsHomeQuery,
    useFindAllJadwalQuery,
    useFindPopularProductsQuery
  
} = apiHomeSlice
