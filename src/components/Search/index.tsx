import { useSearchParams } from "@solidjs/router"
import { JSX, Show, createSignal } from "solid-js"
import { IAnime, ICharacter } from "../../global"
import Results from "../Results"
import './style.css'



type ISearchState = Partial<{
    chars: ICharacter[]
    animes: IAnime[]
    /* [key: string]: any[] */
}>

class SearchHandler { 
    public value: string = ''
    public resolving: boolean = false
    private promise: Promise<void | ISearchState> | null = null

    public handler = async(value: string) => { 
        if (value !== this.value && !this.resolving) { 
            this.resolving = true
            this.promise = new Promise(res => setTimeout(res, 800))
            .then(() => this.resolving = false).then( () => this.fetch() )
        } 

        if (value !== this.value) { this.value = value }
        return this.promise
    }

    async fetch() {
        if (this.value.length >= 4) { 
            const animes = await fetch(`https://api.jikan.moe/v4/anime?q=${this.value}&order_by=popularity`).then(response => { if (response.status === 200) { return response.json() }    else { return {} as {[key: string]: any}}} )
            const characters = await fetch(`https://api.jikan.moe/v4/characters?q=${this.value}&order_by=favorites&sort=desc`).then(response => { if (response.status === 200) { return response.json() }    else { return {} as {[key: string]: any}}} )
            if (characters?.data?.length) { return( {
                    chars: characters?.data?.slice(0, 4) ?? [],
                    animes: animes?.data?.slice(0, 4) ?? [],
            } ) }

        } else if (this.value === '') {
            return({})
        }
    }
}

export default function Search() { 
    const [ searchResults, setResults ] = createSignal<ISearchState>({})
    const [ queryParams ] = useSearchParams()
    const searchHandler = new SearchHandler()

    const search: JSX.EventHandler<HTMLInputElement, Event> = async function( e ) { 
        const response = await searchHandler.handler(e.currentTarget.value)
        if (response) { setResults(response) }
    }

    return (
        <>
            <input type="text" placeholder="Digite sua busca..." 
            value={queryParams.q ?? ''} onInput={search} onFocus={e => { 
                if (!searchResults()?.chars?.length && !searchResults().animes?.length) { search(e) }
            } } class="w-full h-8 rounded-full px-5 text-black" style={ {border: '1px solid rgb(161, 161, 170)'} } />

            <Show when={searchResults()?.chars?.length || searchResults().animes?.length}>
                <Results data={searchResults()} />
            </Show>
        </>
    )
}