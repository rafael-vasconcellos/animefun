import { For, createEffect, createSignal } from "solid-js"
import { genres } from "../genres"
import Category from "./Category"



type Obj<T> = T extends (infer U)[]? U : T
type IGenre = Obj<typeof genres>
type IId = {
    title: string
    value: string
}

function random(n: number) { 
    if (!Number.isNaN(n)) { return Math.round(Math.random()*n) }
    else { return 0 }
}

function getIdsObj(genres: IGenre[]) { 
    return {
        title: genres.map(g => g.name).join(" & "),
        value: genres.map(g => g.mal_id).join()
    }
}


export default function Categories() { 
    const [ ids, setIds ] = createSignal<IId[]>([])

    createEffect( () => { 
        const arr: IId[] = Array(10).fill({})

        const filteredGenres = genres.sort( (b, a) => { 
            if (b.count > a.count) { return -1 }
            else { return 0 }
        } )

        const popularGenres = filteredGenres.slice(0, 20) // até o 15 tem um número bom
        const noPopularGenres = filteredGenres.slice(20, 40)

        for (let i = 0; i < arr.length; i++) {
            const indice = { ...arr[i] };
            const genres = //(i < 5)? 
                [popularGenres[random(19)], noPopularGenres[random(19)]]
                     //: [popularGenres[random(19)], noPopularGenres[random(19)]];
            indice.title = getIdsObj(genres).title;
            indice.value = getIdsObj(genres).value;
            arr[i] = indice
        }

        setIds(arr)
        console.log(arr)
    } )


    return (
        <>
            <For each={ids()}>
                {cat => <Category title={cat.title} genreId={cat.value} />}
            </For>
        </>
    )
}


/*
    https://api.jikan.moe/v4/genres/anime
*/