import { setGlobalState, useGlobalState } from "../store"
import Header from "./Header"
import Hero from "./Hero"
import Web3 from 'web3'

const GarmentsOwner = () => {
    const [nfts] = useGlobalState('ownNfts')
    console.log('propri', nfts)

    const setNFT = (nft) => {
        setGlobalState('nft', nft)
        setGlobalState('showModal', 'scale-100')
    }

    return (
        <>
            <div className="gradient-bg-hero">
                <Header />
                <Hero />
            </div>
            <div className="bg-[#E8ADAA] gradient-bg-artworks">
                <div className="w-4/5 py-10 mx-auto">
                    <h4 className="text-white text-3xl font-bold uppercase text-gradient">
                    {Array.isArray(nfts) && nfts.length > 0 ? 'GarmentDesign NFT creates' : 'No GarmentDesign NFT Yet'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
                    {nfts && nfts.map((nft) => (
                        <div
                            key={nft.id}
                            className="bg-[#a7578c] w-full shadow-xl shadow-black rounded-md overflow-hidden my-2 p-3"
                        >
                        <img
                            src={nft.image}
                            className="h-60 w-full object-contain shadow-lg shadow-black rounded-lg mb-3 max-h-full"
                        />
                        <h4 className="text-white font-semibold">{nft.title}</h4>
                        <p className="text-gray-400 text-xs my-1">
                            {nft.description}
                        </p>
                        <div className="flex justify-between items-center mt-3 text-white">
                            <div className="flex flex-col">
                            <small className="text-xs">Current Price</small>
                            <p className="text-sm font-semibold">{`${nft.price} ETH`}</p>
                            </div>

                            <button
                                onClick={() => setNFT(nft)}
                                className="shadow-lg shadow-black text-white text-sm bg-[#e32970] hover:bg-[#bd255f] cursor-pointer rounded-full px-1.5 py-1"
                            >
                            View Details
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default GarmentsOwner;