import Image from 'next/image'

export function Suprise({ isOpen }: { isOpen: boolean }) {
    return (
        <div
            className={`
                fixed right-52 bottom-0 z-50
                transition-all duration-500 ease-out
                transform
                ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0 pointer-events-none'}
            `}
        >
            <Image
                src="/lgtb-pop-removebg-preview.png"
                alt="Solana"
                width={100}
                height={100}
            />
        </div>
    )
}