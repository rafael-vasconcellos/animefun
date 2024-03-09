import { Accessor, For, Setter } from "solid-js"


export default function Panel( {tagList, filteredCategories, setFilter}: {tagList: string[], filteredCategories: Accessor<string[]>, setFilter: Setter<string[]>} ) { 
    

    function filterCategories() {
        const inputs: HTMLInputElement[] = Array.from(document.querySelectorAll('ul li input'))
        const values = inputs.filter(cat => cat.checked).map(cat => cat.id.replace("panel-", "") )
        setFilter(values)
    }


    return ( 
        <ul class="w-fit h-fit py-3 m-1 bg-zinc-600 rounded-2xl">
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
    )
}