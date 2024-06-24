import { Accessor, For, Setter, Show, createMemo, createSignal } from "solid-js"
import './style.css'



export default function Panel( {tagList, filteredCategories, setFilter}: {tagList: string[], filteredCategories: Accessor<string[]>, setFilter: Setter<string[]>} ) { 
    const [ toggle, setToggle ] = createSignal(2)
    const rotate = createMemo(() => toggle()? "" : "rotate-180")
    const position = createMemo(() => toggle()? "-right-5" : "-right-10 top-4")

    function filterCategories() {
        const inputs: HTMLInputElement[] = Array.from(document.querySelectorAll('ul li input'))
        const values = inputs.filter(cat => cat.checked).map(cat => cat.id.replace("panel-", "") )
        setFilter(values)
    }


    return ( 
        <section class="h-fit flex items-center sticky top-4">
            <Show when={toggle()}>
                <ul class="w-fit h-fit py-3 mb-6 mx-2 bg-zinc-700 rounded-2xl">
                    {/* <li class="mb-3 pb-1 flex gap-6 justify-between" style={ {"border-bottom": '1px solid black'} }>
                        <label for={"panel-amount"} class="px-2">amount:</label>
                        <input type="number" min={1} value={amount()} id={"panel-amount"}
                        class="w-8 bg-inherit" onChange={ e => { 
                            setAmount(e.target.value)
                        } } />
                    </li> */}
                    <For each={ tagList }>
                        { (category) => 
                            <li class="flex justify-between gap-3">
                                <label for={"panel-"+category} class="px-2 text-nowrap">{category}</label>
                                <input class="mx-2" checked={filteredCategories().includes(category)}
                                type="checkbox" id={"panel-"+category} onChange={ e => { 
                                    filterCategories()
                                } } />
                            </li>
                        }
                    </For>
                </ul>
            </Show>

            <button class={`bg-zinc-700 rounded-full absolute ${position()} flex px-0 py-3 items-center`}
             onClick={ () => setToggle(toggle()? 0 : 1) }>
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                 class={`size-6 ${rotate()}`}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>
        </section>
    )
}