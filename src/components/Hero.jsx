import Identicon from 'react-identicons'
import { setGlobalState, useGlobalState, truncate } from '../store'

const Hero = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [currentUser] = useGlobalState('currentUser')

  const onCreatedNFT = () => {
    setGlobalState('modal', 'scale-100')
  }

  return (
    <div
      className="flex flex-col md:flex-row w-4/5 justify-between 
      items-center mx-auto py-10"
    >
      <div className="md:w-3/6 w-full">
        <div>
          <h1 className="text-white text-5xl font-bold">
            Empowering <span className="text-gradient">NFTs</span> <br /> 
            Fashion Designs.
          </h1>
        </div>

        <div className="flex flex-row mt-5">
          {connectedAccount ? (
            <>
              <button
                className="shadow-xl shadow-black text-white
                bg-[#e32970] hover:bg-[#bd255f]
                rounded-full cursor-pointer p-2"
                onClick={onCreatedNFT}
              >
                Create NFT
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div
        className="shadow-xl shadow-black md:w-2/5 w-full 
      mt-10 md:mt-0 rounded-md overflow-hidden bg-gray-800"
      >
        <img
          src="https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjItMDkvODE1ZjQ5YjItNzQxMy00MzYxLTllMmEtNmMwOGZlNjE4OTJiLmpwZw==.jpg"
          alt="NFTs Design"
          className="h-60 w-full object-cover"
        />
        <div className="bg-[#a7578c] flex justify-start items-center p-3">
          <Identicon
            string={
              connectedAccount
                ? connectedAccount.toLowerCase()
                : 'Connect Your Wallet'
            }
            size={50}
            className="h-10 w-10 object-contain rounded-full mr-3"
          />
          <div>
            <p className="text-white font-semibold">
              {connectedAccount
                ? truncate(connectedAccount, 4, 4, 11)
                : 'Connect Your Wallet'}
            </p>
            <small className="text-pink-800 font-bold">@you</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
