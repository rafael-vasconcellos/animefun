import { For, Show, createEffect, createSignal } from "solid-js"
import { randomize, selectedItem } from "../global"
import ErrorCard from '../ErrorCard'



type IQuote = {
    anime: string
    character: string
    quote: string
}

export default function Quotes( props: {search?: string} ) { 
    const [ quotes, setQuotes ] = createSignal<IQuote[]>([])

    createEffect( async() => { 
        if (props.search) { 
            const anime: IQuote[] | [] = await fetch("https://animechan.xyz/api/quotes/anime?title="+props.search)
            .then(response => {
                if (response.status === 200) { return response.json() }
                else { return [] }
            } )

            const character: IQuote[] | [] = await fetch("https://animechan.xyz/api/quotes/character?name="+props.search)
            .then(response => { 
                if (response.status === 200) { return response.json() }
                else { return [] }
            } )

            if (anime.length || character.length) { setQuotes( [...anime, ...character].sort(randomize) ) }


        } else if (!props.search) { 
            const response = await fetch("https://animechan.xyz/api/random").then(response => {
                if (response.status === 200) { return response.json() }
                else { return [] }
            } )
            setQuotes([response])
         }
    } )


    return (
        <main>
            <Show when={quotes() !== null} fallback={<ErrorCard title="No Quotes Found!" />}>
                <Show when={ (quotes()?.length ?? 0) > 0 } fallback={<Placeholder />}>
                    <For each={quotes()}>
                        { (quote: IQuote) => 
                            <div class="bg-zinc-800 w-1/2 px-4 my-10 mx-6 rounded-2xl flex gap-4">
                                <Show when={selectedItem().images?.webp.large_image_url ?? selectedItem().images?.webp.image_url}>
                                    <div style={ {"background-image": `url(${selectedItem().images?.webp.large_image_url ?? selectedItem().images?.webp.image_url})`} }
                                    class="bg-contain bg-no-repeat my-4 min-w-[150px] w-[150px] h-[225px]" />
                                </Show>
                                <div class="py-8">
                                    <span class="italic">"{quote.quote}" - </span>
                                    <span class="text-zinc-400">{quote.character}</span>
                                    <h1 class="py-5 text-xl font-bold">{quote.anime}</h1>
                                </div>
                            </div> 
                        }
                    </For>
                </Show>
            </Show>
        </main>
    )
}


function Placeholder() { 
    const arr = Array(4)

    return (
        <For each={arr}>
            { e => <div class="bg-zinc-800 w-1/2 h-40 px-4 my-10 mx-6 rounded-2xl animate-pulse" /> }
        </For>
    )
}


/*
    https://animechan.xyz/api/random
    /anime?title=naruto
    /character?name=saitama


    https://animechan.xyz/api/quotes
    /anime?title=naruto
    /character?name=saitama
*/