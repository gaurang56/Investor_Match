

export default function Header() {
    return (
        <div className="px-8 py-4 border border-b-[1px] flex gap-4">
            {/* Logo  */}
            <p className="font-bold"> VentureMate</p>
            <div className="flex gap-4">
                <a>Home</a>
                <a>Saved</a>
            </div>
        </div>
    )
}