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
        <section class="absolute z-10 top-14 h-[454px] w-full overflow-y-scroll bg-zinc-500 rounded-xl">
            <For each={props.data.chars}>{item => <CharHCard char={item} />}</For>
            <For each={props.data.animes}>{item => <AnimeHCard anime={item} />}</For>
        </section>
    )
}


