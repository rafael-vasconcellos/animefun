import { createSignal } from "solid-js"


export type IGenre = { 
    mal_id: number
    name: string
    type: string
    url: string
}

type IImage = { 
    image_url: string
    large_image_url: string
    small_image_url: string
}

type IImages = {
    jpg: IImage
    webp: IImage
}

type ITheme = {
    "mal_id": number,
    "type": string,
    "name": string,
    "url": string
}

type ITrailer = {
    "youtube_id": string,
    "url": string,
    "embed_url": string
}

type IProducer = {
    "mal_id": number,
    "type": string,
    "name": string,
    "url": string
}

type ILicensors = {
    "mal_id": number,
    "type": string,
    "name": string,
    "url": string
}

type IStudio = {
    "mal_id": number,
    "type": string,
    "name": string,
    "url": string
}

export type IAnime = { 
    title: string
    title_english: string
    type: string
    score: number
    rank: number
    popularity: number
    favorites: number
    episodes: number
    mal_id: number
    url: string
    genres: IGenre[]
    images: IImages
}

export type ICharacter = {
    about: string | null
    favorites: number
    mal_id: number
    url: string
    name: string
    name_kanji: string | null
    nicknames: string[]
    images: IImages
}

export type IAnimeDetailed = { 
    "mal_id": number,
    "url": string,
    "approved": boolean,
    "title": string,
    "title_english": string,
    "title_japanese": string,
    "type": string,
    "source": string,
    "episodes": number,
    "status": string,
    "airing": boolean,
    "duration": string,
    "rating": string,
    "score": number,
    "scored_by": number,
    "rank": number,
    "popularity": number,
    "members": number,
    "favorites": number,
    "synopsis": string,
    "background": string,
    "season": string,
    "year": number,
    "title_synonyms": string[],
    "broadcast": {
        "day": string,
        "time": string,
        "timezone": string,
        string: string
    },
    "producers": IProducer[],
    "licensors": ILicensors[],
    "studios": IStudio[],
    "genres": IGenre[],
    "explicit_genres": IGenre[],
    "themes": [],
    "demographics": {
        "mal_id": number,
        "type": string,
        "name": string,
        "url": string
    }[]
    "images": IImages,

    "trailer": ITrailer,
    "titles": {
        "type": string,
        "title": string
    }[],
    "aired": any,
}

export type ITop<T> = { 
    "data": T[],
    "pagination": {
        "last_visible_page": number,
        "has_next_page": true,
        "items": {
            "count": number,
            "total": number,
            "per_page": number
        }
    }
}




type ICategories = Partial<{ 
    sfw: string[]
    nsfw: string[]
    /* [key: string]: string[] */
}>

export type ICategoriesStore = { 
    cats: any
    list: {url: string}[]
    /* [key: string]: any */
}

type IResponses = {
    results?: {url: string}[]
    images?: {url: string}[]
    url?: string
}


export const [ selectedItem, setItem ] = createSignal<Partial<IAnime & ICharacter>>({} as IAnime)
export const primary_color = "bg-cyan-400"

export const categoriesFull: ICategories = {
    sfw: [
        'waifu', 'neko', 'shinobu', 'awoo', 'wink', 'blush', 'bite', 'megumin', 'cuddle', 'pat', 'poke', 

        'kitsune', 'sleep', 'peck', 'tickle', 'think', 'feed', 'yawn', 'baka', 'nod', 'nope', 'pout', 
        'thumbsup', 'laugh', 
    ],
}

export const categoriesNSFW = {
    nsfw: [
        //'waifu', 'neko', 'blowjob', //'trap'
        "ass", "hentai", "milf", "oral", "paizuri", "ecchi", "ero"
    ]
}

export const test: ICategories = {
    "sfw": [ 
      "waifu",
      "maid", "marin-kitagawa", "mori-calliope", "raiden-shogun", "oppai", "selfies", "uniform", "kamisato-ayaka"
    ]
}

const tagsSet = new Set( [...test.sfw ?? [], ...categoriesFull.sfw ?? []] )
export const tagList = Array.from(tagsSet)



export async function get_images(link: string, categories: ICategories, mode: 'list' | 'cats') { 
    if ( link && (mode !== undefined) && (categories.sfw?.length || categories.nsfw?.length) ) { 
            const requests: Promise<ICategoriesStore | void | null>[] = []
            const images: ICategoriesStore = { 
                list: [],
                cats: {}
            }
            const keys = Object.keys(categories) as (keyof ICategories)[]
            for (let key of keys) {
                categories[key]?.forEach(category => { if (key && category) { 
                    let url = link.replace('{key}', key)
                    url = url.replace('{category}', category)
                    requests.push(fetch(url, {
                        /* method: 'POST',
                        body: JSON.stringify({exclude: []}) */
                    } )
                    .then(response => { 
                        if (response.status === 200) { return response.json() }
                        else { throw new Error() }
                    } ).then( (res: IResponses) => res.results ?? res.images ?? res.url )
                    .then(result => { if (result) {
                            if (images[mode]?.length !== undefined) { images[mode]?.push(result) }
                            else if ( !images[mode][category] ) { images[mode][category] = result }
                            else { images[mode][category]?.push(result) }

                    } } ).catch(e => null) )
                } } )
            }

            return await Promise.all(requests).then( () => {
                if (images[mode].length || Object.keys(images[mode]).length) { return images[mode] }
                else { return null }
            } )

    } else { return {} }
}


export async function sfwHandler(freshNew: string[]) {
    const images = await get_images(
        `https://nekos.best/api/v2/{category}?amount=${"4"}`, 
        { sfw: freshNew?.filter(e => categoriesFull.sfw?.includes(e)) }, 
        'cats'
    )

    const images2 = await get_images(
        `https://api.waifu.im/search?included_tags={category}&many=true`, 
        { sfw: freshNew?.filter(e => test.sfw?.includes(e)) }, 
        'cats'
    )

    const result = { ...images }
    Object.keys(images2).forEach(category => { 
        result[category] = [ ...images[category], ...images2[category] ]
    })
    return result
}


export async function nsfwHandler(freshNew: string[]) {
    const images = await get_images(
        `https://api.waifu.im/search?included_tags={category}&many=true`, 
        { nsfw: freshNew.filter(e => categoriesNSFW.nsfw?.includes(e)) }, 
        'cats'
    )

    return images
}


export function randomize() { 
    const num = Math.round(Math.random())
    return num >= 1? -1 : 0
}






export const categoriesBase: ICategories = { 
    sfw: [
        'waifu', 'neko', 'shinobu', 'awoo', 'wink', 'blush', 'bite', 'megumin', 'cuddle', 'pat', 'poke', 
    ],
    nsfw: [
        'waifu', 'neko', 'blowjob', //'trap'
    ]
}




/*
    
*/


















// `https://api.waifu.pics/${key}/${category}`
// uptadeRequests(key, category, [ {url: res?.url} ])

/*
    'handhold', 'hug', 'bully', 'kill', 'bonk', 'yeet', 'glomp', 'highfive', 'wave', 'slap', 'dance', 'kick', 
    'nom', 'cringe', 'smug', 'cry', 'smile', 'kiss', 
*/


//'waifu', 'neko', 'shinobu', 'awoo', 'wink', 'blush', 'bite', 'megumin', 'cuddle', 'pat', 'poke', 
//'happy', 'lick'
















// `https://nekos.best/api/v2/${category}?amount=4`
// `https://nekos.best/api/v2/search?query=X&category=X&amount=X`
// /search?query=X&type=X&category=X&amount=X
// -> type: img ou gifs

/*
    'lurk', 'stare', 'husbando', 'facepalm', 'shoot', 'punch', 'shrug', 'handshake', 'bored', 
*/


//'kitsune', 'sleep', 'peck', 'tickle', 'think', 'feed', 'yawn', 'baka', 'nod', 'nope', 'pout', 
//'thumbsup', 'laugh', 




