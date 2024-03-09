import { useNavigate } from "@solidjs/router"
import { IAnime, IAnimeDetailed, ICharacter, setItem } from "../global"
import { Show } from "solid-js"
import { setVisibility, visibility } from "../Home"



type IData = Partial<IAnimeDetailed & ICharacter>

function click_handler(obj: IData) { 
    if (obj) { 
        setItem(obj)
        if (visibility() !== 1) { setVisibility(1) }
    }
}

export function AnimeHCard( {anime}: {anime: IAnime} ) { console.log(anime.rank)
    const navigate = useNavigate()

    return (
        <div class={`py-1 px-2 flex gap-2 relative cursor-pointer hover:bg-cyan-400`} onClick={() => { 
            if (!anime?.title_english?.toLowerCase()) { return }
            click_handler(anime)
            navigate(`/search?q=${anime?.title_english?.toLowerCase()}`)
        } }>
            <div class="w-[60px] h-[84px] bg-contain bg-no-repeat" style={ {'background-image': `url(${anime.images.webp.large_image_url})`} } />
            <div>
                <p>{anime.title_english}</p>
                <p>Type: {anime.type} - {anime.episodes} episodes</p>
                <span class="flex gap-1 items-center py-1">
                    <div class="w-4 h-4 bg-contain" style={ {"background-image": `url(/star.png)`} } />
                    <i class="text-zinc-400 text-sm">{anime.score}/10</i>
                </span>
            </div>
            <Show when={anime.rank < 100}>
                <div class="absolute top-1/4 right-2 flex gap-1 items-center">
                    <b>Top {anime.rank}</b>
                    <div class="w-6 h-6 bg-contain" style={ {"background-image": `url(/fire.png)`} } />
                </div>
            </Show>
        </div>
    )
}


export function CharHCard( {char}: {char: ICharacter} ) { 
    const navigate = useNavigate()

    return (
        <div class={`py-1 px-2 flex gap-2 relative cursor-pointer hover:bg-cyan-400`} onClick={() => { 
            if (!char?.name?.toLowerCase()) { return }
            click_handler(char)
            navigate(`/search?q=${char?.name?.toLowerCase()}`)
        } }>
            <div class="w-[60px] h-[84px] bg-contain bg-no-repeat" style={ {'background-image': `url(${char.images.webp.image_url})`} } />
            <div>
                <p>{char?.name}</p>
                <p>Personagem</p>
                {char?.nicknames?.map(nickname => <i class="text-zinc-400 text-sm">{nickname} - </i>)}
            </div>
        </div>
    )
}


export function ItemVCard( {item}: {item: IData} ) { 
    const navigate = useNavigate()

    return (
        <div class="cursor-pointer min-w-[150px] w-[150px] my-3" onClick={ () => { 
            const condition = item?.name?.toLowerCase() ?? item?.title_english?.toLowerCase()
            if (condition) {
                click_handler(item)
                navigate(`/search?q=${condition}`)
            }
        } }>
            <div class="h-[225px] w-full bg-zinc-500 bg-contain" style={ {"background-image": `url(${item.images?.webp.large_image_url ?? item.images?.webp.image_url})`} } />
            <p class="my-2">{ (item.title_english ?? item.title) ?? item.name }</p>
        </div>
    )
}