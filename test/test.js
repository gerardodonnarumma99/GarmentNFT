const Garment = artifacts.require('Garment');

contract('Garment', (accounts) => {
  let garmentInstance;
  const artist = accounts[1]; // Indirizzo per pre-creare un NFT
  const buyer = accounts[2]; // Indirizzo dell'acquirente

  beforeEach(async () => {
    garmentInstance = await Garment.new('Garment', 'GAR', { from: accounts[0] });
  });

  it('should allow the purchase of a garment', async () => {
    const price = web3.utils.toWei('1', 'ether'); // Definizione della variabile price

    // Create a garment
    await garmentInstance.createGarment(
        web3.utils.toWei('0.000001', 'ether'),
        'Garment',
        'This is a test garment',
        'M',
        'Blue',
        'Cotton',
        'base64-image',
        { from: artist, value: price }
    );

    // Purchase the garment
    await garmentInstance.purchaseGarment(1, { from: buyer, value: web3.utils.toWei('1', 'ether') });

    // Assert the new owner of the garment
    const purchasedGarment = await garmentInstance.getNFT(1);
    assert.equal(purchasedGarment.owner, buyer, 'Garment ownership transfer failed');
  });

  it('should return all NFTs', async () => {
    // Create multiple garments
    await garmentInstance.createGarment(
      web3.utils.toWei('1', 'ether'),
      'Garment 1',
      'This is garment 1',
      'M',
      'Blue',
      'Cotton',
      'base64-image-1',
      { from: artist, value: web3.utils.toWei('1', 'ether') }
    );

    await garmentInstance.createGarment(
      web3.utils.toWei('2', 'ether'),
      'Garment 2',
      'This is garment 2',
      'L',
      'Red',
      'Silk',
      'base64-image-2',
      { from: artist, value: web3.utils.toWei('2', 'ether') }
    );

    // Retrieve all NFTs
    const allNFTs = await garmentInstance.getAllNFTs();
    assert.equal(allNFTs.length, 2, 'Incorrect number of NFTs returned');
  });
});