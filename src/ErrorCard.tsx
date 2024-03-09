export default function ErrorCard( {title}: {title: string} ) {

    return (
        <div class="w-full h-64 flex justify-center items-center">
            <p class="text-zinc-500 font-bold text-4xl">{title}</p>
        </div>
    )
}