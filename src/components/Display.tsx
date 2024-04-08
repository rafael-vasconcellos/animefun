import { For, Show, createEffect, createSignal } from "solid-js"
import { IAnimeDetailed, ICharacter, ITop } from "../global"
import { ItemVCard } from "./Cards"
import { visibility } from "../Home"



type IDisplayProps = {
    type: "anime" | "characters"
    title: string
}

type IData = Partial<IAnimeDetailed & ICharacter>

export default function Display( {type, title}: IDisplayProps ) { 
    const [ data, setData ] = createSignal<IData[]>([])

    createEffect(() => { 
        if (type === 'anime' || type === 'characters') {
            fetch(`https://api.jikan.moe/v4/top/${type}?filter=airing`).then(response => { 
                if (response.status === 200) { return response.json() }
                else { return {} as ITop<IData> }
            } ).then( (response: ITop<IData>) => response?.data?.length? setData(() => response.data) : null )
        }
    } )

    return (
        <Show when={visibility() === 0}>
            <div class="py-4 text-primary">
                <h1 class="my-4 mx-2 font-bold text-2xl">{title}</h1>
                <div class="flex flex-wrap gap-4 w-full px-3">
                    <Show when={data().length > 0} fallback={<Placeholder />}>
                        <Wrap data={data()} />
                    </Show>
                </div>
            </div>
        </Show>
    )
}


function Wrap( {data}: {data: IData[]} ) {

    return (
        <For each={data}>
            {item => <ItemVCard item={item} />}
        </For>
    )
}


function Placeholder() { 
    const arr = Array(8)

    return (
        <For each={arr}>
            { () => <div class="w-[150px] h-[225px] bg-zinc-400 animate-pulse" /> }
        </For>
    )
}


/*
    https://api.jikan.moe/v4/top/anime?filter=airing
    https://api.jikan.moe/v4/top/characters
*/