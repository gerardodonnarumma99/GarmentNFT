import Web3 from 'web3'
import { setGlobalState, getGlobalState, setAlert } from './store'
import GarmentNFT from './abis/Garment.json'

const { ethereum } = window

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])
  } catch (error) {
    setAlert(JSON.stringify(error), 'red')
  }
}

const structuredNfts = (nfts) => {
  return nfts
    .map((nft) => ({
      id: Number(nft.id),
      owner: nft.owner,
      artist: nft.artist,
      price: window.web3.utils.fromWei(nft.price),
      title: nft.title,
      description: nft.description,
      size: nft.size,
      fabric: nft.fabric,
      color: nft.color,
      image: nft.image,
      timestamp: nft.timestamp,
    }))
    .reverse()
}

const loadWeb3 = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')

    window.web3 = new Web3(ethereum)

    window.web3 = new Web3(window.web3.currentProvider)

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setGlobalState('connectedAccount', accounts[0])

    const networkId = await web3.eth.net.getId()
    console.log('networkId', networkId)
    const networkData = GarmentNFT.networks[networkId]
    console.log('networkData', networkData)

    if (networkData) {
      const contract = new web3.eth.Contract(
        GarmentNFT.abi,
        networkData.address
      )
      console.log('contract', contract)
      const nfts = await contract.methods.getAllNFTs().call()
      const ownNfts = await contract.methods.getGarmentsByOwner().call({ from: accounts[0] })

      setGlobalState('ownNfts', structuredNfts(ownNfts))
      setGlobalState('nfts', structuredNfts(nfts))
      setGlobalState('contract', contract)
    } else {
      window.alert('GarmentNFT contract not deployed to detected network.')
    }
  } catch (error) {
    console.log('Error: ', error)
    alert('Please connect your metamask wallet!')
  }
}

const mintNFT = async ({ title, price, description, size, color, fabric, imgBase64, qrCodeBase64 }) => {
  try {
    price = window.web3.utils.toWei(price.toString(), 'ether')
    const contract = getGlobalState('contract')
    const account = getGlobalState('connectedAccount')
    const mintPrice = window.web3.utils.toWei('0.01', 'ether')

    await contract.methods
      .createGarment(price, title, description, size, color, fabric, imgBase64)
      .send({ from: account, value: mintPrice })

    return true
  } catch (error) {
    console.log('Error: ', error.message)
    setAlert(error.message, 'red')
  }
}

const buyNFT = async ({ id, price }) => {
  try {
    const cost = window.web3.utils.toWei(price, 'ether')
    const contract = getGlobalState('contract')
    const buyer = getGlobalState('connectedAccount')

    await contract.methods.purchaseGarment(Number(id)).send({ from: buyer, value: cost })

    return true
  } catch (error) {
    console.log('Error', error)
    setAlert(error.message, 'red')
  }
}

const updateNFT = async ({ id, cost }) => {
  try {
    cost = window.web3.utils.toWei(cost.toString(), 'ether')
    const contract = getGlobalState('contract')
    const buyer = getGlobalState('connectedAccount')

    await contract.methods.changePrice(Number(id), cost).send({ from: buyer })

    return true
  } catch (error) {
    setAlert(error.message, 'red')
  }
}

const subscribeToSaleEvent = async () => {
  const contract = getGlobalState('contract')
  const connectedAccount = getGlobalState('connectedAccount')

  if(!contract) return

  contract.events.Sale()
    .on('data', async (event) => {
      console.log('Sale event:', event.returnValues);
      const nfts = await contract.methods.getAllNFTs().call()
      setGlobalState('nfts', structuredNfts(nfts))
      const ownNfts = await contract.methods.getGarmentsByOwner().call({ from: connectedAccount })
      setGlobalState('ownNfts', structuredNfts(ownNfts))
    })
    .on('error', error => {
      console.error('Error listening to Sale event:', error);
    });
};

export { loadWeb3, connectWallet, mintNFT, buyNFT, updateNFT, subscribeToSaleEvent }
