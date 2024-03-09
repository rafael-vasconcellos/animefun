import { Component, Show } from "solid-js"
import { For } from "solid-js"

const List: Component<{name?: string, list: {url: string}[]}> = function ( {name, list} ) { 

    return (
        <div class="py-4">
            <Show when={name}>
                <h1 class="text-2xl font-bold py-4 px-3">{name}</h1>
            </Show>
            <div class="w-fit px-3 flex flex-wrap justify-center">
                <For each={list}>
                    { (obj) => <img src={obj?.url} class="max-w-md" style={ {"max-height": '28rem'} } /> }
                </For>
            </div>
        </div>
    )
}

export default List