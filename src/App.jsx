
import { useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import { loadWeb3, subscribeToSaleEvent } from './GarmentNFT'
import Home from './components/Home'
import GarmentsOwner from './components/GarmentsOwner';

const NotFound = () => {
  <div>Not Found</div>
}

const App = () => {
  useEffect(async () => {
    await loadWeb3()
    subscribeToSaleEvent()
    //isUserLoggedIn()
  }, [])

  return (
    <div className="min-h-screen">
      <Routes>
          <Route index path="/:idNFT?" element={<Home />} />
          <Route exact path="/own_nfts" element={<GarmentsOwner />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
