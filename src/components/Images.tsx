import { createStore, produce } from 'solid-js/store'
import { For, Show, createEffect, createMemo, createSignal } from 'solid-js'
import { ICategoriesStore } from '../global'
import List from './List'
import Panel from './Panel'
import { visibility } from '../Home'



type IImagesProps = { 
    tagList: string[]
    callback(freshNew: string[]): Promise<unknown>
    visibilityC?: number
    placeholder?: string[]
    search?: string
}

//export const [ amount, setAmount ] = createSignal("4")

export default function Images( {placeholder, tagList, callback, visibilityC, search}: IImagesProps ) { 
    const [ filteredCategories, setFilter ] = createSignal<string[]>([])
    const [ requests, uptadeRequests ] = createStore<ICategoriesStore>( { 
        cats: {},
        list: []
    } )
    const condition = createMemo( () => visibilityC? visibility() === visibilityC : true )


    createEffect( async() => { 
        const freshNew = filteredCategories().filter(c =>  (!requests.cats[c] || requests.cats[c]?.length === 0) )
        if (freshNew.some(e => !tagList.includes(e)))  { return null }
        if (!filteredCategories().length && placeholder?.length) { setFilter(placeholder) }

        // deleta do store as categorias não selecionadas
        Object.keys(requests.cats).forEach(c => { 
            if ( !filteredCategories().includes(c) ) { 
                uptadeRequests( produce(s => delete s.cats[c]) )
            }
        } )

        if (filteredCategories().length && freshNew.length) { 
            const images = await callback(freshNew)
            if (images) { uptadeRequests('cats', images) }
        }

        
    } )



    return ( 
        <Show when={condition()}>
            <main class='flex gap-4'>
                <Panel tagList={tagList} filteredCategories={filteredCategories} setFilter={setFilter} />
                <div class='w-full min-w-[360px]'>
                    <For each={ Object.keys(requests.cats) }>
                        { categoryName => <List name={categoryName} list={requests.cats[categoryName]} /> }
                    </For>
                </div>
            </main>
        </Show>
    )
}


/*
    EmbeddedComponent, NestedComponent, ContainedComponent, InnerComponent, EnclosedComponent

    awoo, megumin
    think, feed

    if (search && filteredCategories().length > 0 && freshNew.length > 0) { 
            const images = await get_images(`https://nekos.best/api/v2/search?query=${search}&type=png&category={category}&amount=${amount()}`, {sfw: freshNew}, 'cats')
            const gifs = await get_images(`https://nekos.best/api/v2/search?query=${search}&type=gif&category={category}&amount=${amount()}`, {sfw: freshNew}, 'cats')
            uptadeRequests('cats', Object.assign(images, gifs))

    } else 
*/