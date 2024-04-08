import { For } from "solid-js"
import { IAnime, ICharacter } from "../global"
import { AnimeHCard, CharHCard } from "./Cards"



type IResultsProps = {
    data: {
        animes?: IAnime[], 
        chars?: ICharacter[]
    }
}

export default function Results( props: IResultsProps ) { 

    return (
        <section class="bg-zinc-700 absolute z-10 top-14 overflow-y-scroll h-[454px] w-full py-2 rounded-xl">
            <For each={props.data.chars}>{item => <CharHCard char={item} />}</For>
            <For each={props.data.animes}>{item => <AnimeHCard anime={item} />}</For>
        </section>
    )
}


