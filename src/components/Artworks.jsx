import { useEffect, useState } from 'react'
import { setGlobalState, useGlobalState, truncate } from '../store'
import QRCode from 'react-qr-code';

const Artworks = ({ idNFT }) => {
  const [nfts] = useGlobalState('nfts')
  const [end, setEnd] = useState(4)
  const [count] = useState(4)
  const [collection, setCollection] = useState([])

  useEffect(() => {
    if(!idNFT) return;

    const nft = nfts.find(({ id }) => parseInt(id) === parseInt(idNFT))
    if(!nft) return;

    setNFT(nft)
  }, [idNFT, nfts])

  const setNFT = (nft) => {
    setGlobalState('nft', nft)
    setGlobalState('showModal', 'scale-100')
  }

  const getCollection = () => {
    return nfts.slice(0, end)
  }

  useEffect(() => {
    setCollection(getCollection())
  }, [nfts, end])
  

  return (
    <div className="bg-[#E8ADAA] gradient-bg-artworks">
      <div className="w-4/5 py-10 mx-auto">
        <h4 className="text-white text-3xl font-bold uppercase text-gradient">
          {collection.length > 0 ? 'GarmentDesign NFT creates' : 'No GarmentDesign NFT Yet'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
          {collection.map((nft) => (
            <div
              key={nft.id}
              className="bg-[#a7578c] w-full shadow-xl shadow-black rounded-md overflow-hidden my-2 p-3"
            >
              <img
                src={nft.image}
                alt={truncate(nft.title, 6)}
                className="h-60 w-full object-contain shadow-lg shadow-black rounded-lg mb-3 max-h-full"
              />
              <h4 className="text-white font-semibold">{nft.title}</h4>
              <p className="text-gray-400 text-xs my-1">
                {truncate(nft.description)}
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

        {collection.length > 0 && nfts.length > collection.length ? (
          <div className="text-center my-5">
            <button
              className="shadow-xl shadow-black text-white
            bg-[#e32970] hover:bg-[#bd255f]
            rounded-full cursor-pointer p-2"
            onClick={() => setEnd(end + count)}
            >
              Load More
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Artworks
