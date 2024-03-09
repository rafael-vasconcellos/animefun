import { For, Show, createEffect, createSignal } from "solid-js"
import { IAnime, ITop } from "../../global"
import { ItemVCard } from "../Cards"
import './style.css'


export default function Category( {title, genreId}: {title: string, genreId: string} ) { 
    let slider: HTMLDivElement | undefined
    const [ data, setData ] = createSignal<IAnime[]>([])

    createEffect( async() => { 
        const response: ITop<IAnime> = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}`).then(response => { 
            if (response.status === 200) { return response.json() }
            else { return {} as any }
        } )

        if (response?.data?.length) { setData(response.data) }
        console.log(response)
    } )


    return ( 
        <Show when={data().length}>
            <div class="category">
                    <h1 class="my-4 mx-2 font-bold text-2xl">{title}</h1>
                    <div class="flex gap-3 items-center w-full">
                        <div class="cursor-pointer h-full">
                            <button class="bg-zinc-700 rounded-full px-4 pb-3 pt-2 font-bold text-4xl"
                            onClick={() => slider?.scrollBy(-slider?.offsetWidth, 0)}>
                                {"<"}
                            </button>
                        </div>

                        <div ref={slider} class='flex gap-5 items-start px-3 overflow-x-scroll scroll-smooth'>
                            <For each={data()}>
                                {anime => <ItemVCard item={anime} />}
                            </For>
                        </div>

                        <div class="cursor-pointer h-full">
                            <button class="bg-zinc-700 rounded-full px-4 pt-2 pb-3 font-bold text-4xl"
                            onClick={() => slider?.scrollBy(slider?.offsetWidth, 0)}>
                                {">"}
                            </button>
                        </div>
                    </div>
            </div>
        </Show>
    )
}




/*
    https://api.jikan.moe/v4/genres/anime
    https://api.jikan.moe/v4/anime?genres=2
*/