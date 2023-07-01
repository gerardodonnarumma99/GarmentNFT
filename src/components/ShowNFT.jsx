import Identicon from 'react-identicons'
import { FaTimes } from 'react-icons/fa'
import { buyNFT } from '../GarmentNFT'
import { useGlobalState, setGlobalState, truncate, setAlert } from '../store'
import QRCode from 'react-qr-code'

const ShowNFT = () => {
  const [showModal] = useGlobalState('showModal')
  const [currentUser] = useGlobalState('currentUser')
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [nft] = useGlobalState('nft')

  const onChangePrice = () => {
    setGlobalState('nft', nft)
    setGlobalState('showModal', 'scale-0')
    setGlobalState('updateModal', 'scale-100')
  }

  const handleNFTPurchase = () => {
    setGlobalState('showModal', 'scale-0')
    setGlobalState('loading', {
      show: true,
      msg: 'Initializing NFT transfer...',
    })

    try {
      buyNFT(nft).then((res) => {
        if (res) {
          setAlert('Transfer completed...', 'green')
          window.location.reload()
        }
      })
    } catch (error) {
      console.log('Error transfering NFT: ', error)
      setAlert('Purchase failed...', 'red')
    }
  }

  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-screen h-screen flex items-center
        justify-center bg-black bg-opacity-50 transform
        transition-transform duration-300 ${showModal}`}
      >
        <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold text-gray-400">Buy NFT</p>
              <button
                type="button"
                onClick={() => setGlobalState('showModal', 'scale-0')}
                className="border-0 bg-transparent focus:outline-none"
              >
                <FaTimes className="text-gray-400" />
              </button>
            </div>

            <div className="flex flex-row justify-center items-center rounded-xl mt-5">
              <div className="shrink-0 rounded-xl overflow-hidden h-40 w-40">
                <img
                  className="h-full w-full object-cover cursor-pointer"
                  src={nft?.image}
                  alt={nft?.title}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-xl mt-5">
              <div className="flex flex-col justify-center items-center mx-auto">
                <div className="my-2">
                  <label className="text-white font-semibold">Title: </label>
                  <span className="text-slate-400">{nft?.title}</span>
                </div>

                <div className="my-2">
                  <label className="text-white font-semibold">Description: </label>
                  <span className="text-slate-400">{nft?.description}</span>
                </div>

                <div className="my-2">
                  <label className="text-white font-semibold">Color: </label>
                  <span className="text-slate-400">{nft?.color}</span>
                </div>

                <div className="my-2">
                  <label className="text-white font-semibold">Fabric: </label>
                  <span className="text-slate-400">{nft?.fabric}</span>
                </div>

                <div className="my-2">
                  <label className="text-white font-semibold">Size: </label>
                  <span className="text-slate-400">{nft?.size}</span>
                </div>

                <div className="my-2">
                  <label className="text-white font-semibold">Current Price: </label>
                  <span className="text-slate-400">{nft?.price} ETH</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-1 text-white justify-center my-5">
              <div className="flex flex-col justify-center items-center mx-auto">
                <Identicon
                    string={nft?.owner.toLowerCase()}
                    size={50}
                    className="h-10 w-10 object-contain rounded-full mr-3"
                  />
                  <div className="flex flex-col justify-center items-start">
                    <small className="text-white font-bold">@artist</small>
                    <small className="text-pink-800 font-semibold">
                      {nft?.artist ? truncate(nft.artist, 4, 4, 11) : '...'}
                    </small>
                  </div>
              </div>

              <div className="flex flex-col justify-center items-center mx-auto">
                <Identicon
                    string={nft?.owner.toLowerCase()}
                    size={50}
                    className="h-10 w-10 object-contain rounded-full mr-3"
                  />
                  <div className="flex flex-col justify-center items-start">
                    <small className="text-white font-bold">@owner</small>
                    <small className="text-pink-800 font-semibold">
                      {nft?.owner ? truncate(nft.owner, 4, 4, 11) : '...'}
                    </small>
                  </div>
              </div>

              <div className="flex flex-col justify-center items-center mx-auto">
                <QRCode value={`http://localhost:3000/${nft?.id}`} size={50} />
              </div>

              </div>
            </div>
            {connectedAccount != nft?.owner ? (
              <div className="flex flex-row justify-between items-center">
                <button
                  className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#e32970]
              hover:bg-[#bd255f] py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#e32970]
              hover:border hover:border-[#bd255f]
              focus:outline-none focus:ring mt-5"
                  onClick={handleNFTPurchase}
                >
                  Purchase Now
                </button>
              </div>
            ) : (
              <button
                className="flex flex-row justify-center items-center
            w-full text-white text-md bg-[#e32970]
            hover:bg-[#bd255f] py-2 px-5 rounded-full
            drop-shadow-xl border border-transparent
            hover:bg-transparent hover:text-[#e32970]
            hover:border hover:border-[#bd255f]
            focus:outline-none focus:ring mt-5"
                onClick={onChangePrice}
              >
                Change Price
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowNFT
