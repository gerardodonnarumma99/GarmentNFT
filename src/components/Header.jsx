import { useGlobalState } from '../store'
import garment from '../assets/garment.png'
import { connectWallet } from '../GarmentNFT'
import { Link } from 'react-router-dom'

const Header = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')

  return (
    <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img
          className="w-48 cursor-pointer"
          src={garment}
          alt="GarmentDesign"
        />
      </div>

      <ul
        className="md:flex-[0.2] text-white md:flex
        hidden list-none flex-row justify-between 
        items-center flex-initial"
      >
        <li className="mx-4 cursor-pointer font-bold"><Link to="/">Home</Link></li>
        <li className="mx-4 cursor-pointer font-bold"><Link to="/own_nfts">Own NFTs</Link></li>
      </ul>

      {!connectedAccount ? (
        <button
          className="shadow-xl shadow-black text-white
        bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2
          rounded-full cursor-pointer"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <></>
      )}
    </nav>
  )
}

export default Header
