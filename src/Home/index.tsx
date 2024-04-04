import { Show, createEffect, createSignal } from "solid-js"
import { useSearchParams, useNavigate } from '@solidjs/router'
import { setItem, tagList, sfwHandler, categoriesNSFW, nsfwHandler } from "../global"
import Quotes from "../components/Quotes"
import Images from "../components/Images"
import Search from "../components/Search"
import Display from "../components/Display"
import Categories from "../components/Categories"
import './style.css'



export const [ visibility, setVisibility ] = createSignal(0)

export default function Home() { 
    const [ quotesQuery, setQuotesQuery ] = createSignal<string | undefined>('')
    const [ queryParams ] = useSearchParams()
    const navigate = useNavigate()
    let lucky: HTMLButtonElement | undefined

    createEffect( () => { 
        if ( (queryParams?.q !== quotesQuery()) && queryParams.q ) { 
            setQuotesQuery(queryParams.q)
            if (visibility() !== 1) { setVisibility(1) }

        } else if (queryParams?.nsfw === 'on' && lucky) { 
            lucky.classList.remove('opacity-45')
            const img = lucky.children[0] as HTMLImageElement | undefined
            if (img) { img.src = "https://i.ibb.co/vZhNsqf/dat.png" }
            lucky.onclick = () => {
                if (visibility() !== 3) { setVisibility(3) }
            }

        }
    } )


    return (
        <>
            <section class="flex justify-center">
                <div class="w-[600px] p-3 flex flex-col gap-4 items-center relative">
                        <Search />
                        <div class="flex gap-2">
                                <button class="flex gap-2 items-center min-w-fit" onClick={() => { 
                                    const input: HTMLInputElement | null = document.querySelector('input[type=search]')
                                    if ( (input?.value !== queryParams?.q) && input?.value ) { navigate(`/search?q=${input.value}`) }
                                    if (visibility() !== 1) { setVisibility(1) } // caso a pesquisa já tenha sido feita (queryParams?.q === quotesQuery())
                                    else if (!input?.value && !quotesQuery()) { 
                                        setQuotesQuery(prev => prev===''? undefined : '') 
                                    }
                                    setItem({})
                                } }>
                                    <div class="w-5 h-5 bg-contain bg-no-repeat" style={ {"background-image": `url(quote.png)`} } />
                                    <span class="text-nowrap">Quote</span>
                                </button>

                                <button class="flex gap-1 items-center min-w-fit" onClick={ () => {
                                    if (visibility() !== 2) { setVisibility(2) }
                                } }>
                                    <img src="https://i.ibb.co/R2ZWHm1/yor.png" class="h-5" />
                                    <span class="text-nowrap">Random Waifu</span>
                                </button>

                                <button class="opacity-45 flex gap-1 items-center min-w-fit" ref={lucky}>
                                    <img src="heart.png" class="h-5" />
                                    <span class="text-nowrap">Estou com sorte</span>
                                </button>
                        </div>
                </div>
            </section>


            <Display title="Trending anime" type="anime" />
            <Display title="Trending Anime Characters" type="characters" />
            {/* <Categories /> */}
            <Show when={visibility() !== 0}>
                <button class="relative z-0 left-[47%] my-4" onClick={() => { 
                    setVisibility(0)
                    navigate('/')
                } }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>
                </button>
            </Show>
            <Show when={visibility() === 1}>
                <Quotes search={quotesQuery()} />
            </Show>
            <Images visibilityC={2} tagList={tagList} callback={sfwHandler} placeholder={ ['waifu'] } />
            <Show when={queryParams?.nsfw === 'on'}>
                <Images visibilityC={3} tagList={categoriesNSFW.nsfw} callback={nsfwHandler} placeholder={ ['hentai'] } />
            </Show>

            {/* <Show when={visibility() === 3 && nsfw().length > 0}>
                <Show when={nsfw() !== null} fallback={ <ErrorCard title="Unexpected Error!" /> }>
                    <List list={nsfw()} />
                </Show>
            </Show> */}
        </>
    )
}





/*
    https://api.jikan.moe/v4/anime?q=naruto

    https://api.waifu.pics/{key}/{category}
*/