// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Garment is ERC721Enumerable, Ownable {
    //using Strings for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private germantIds; //Permette di gestire gli ID degli NFT
    uint256 private cost; //Costo di creazione di un indumento
    uint256 private artistRoyaltyPercentage; // Percentuale fissa della commissione dell'artista

    event Sale(
        uint256 id,
        address owner,
        address artist,
        uint256 price,
        string title,
        string description,
        string size,
        string color,
        string fabric,
        string image,
        uint256 timestamp
    );

    struct GarmentDetails {
        uint256 id;
        address owner;
        address artist;
        uint256 price;
        string title;
        string description;
        string size; //Taglia dell'indumento
        string color; //Colore dell'indumento
        string fabric; //Tessuto dell'indumento
        string image; //Immagine (base64) dell'indumento
        uint256 timestamp; //Quando viene creato/aggiornato l'indumento
    }

    GarmentDetails[] minted;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        cost = 0.01 ether;
        artistRoyaltyPercentage = 10;
    }

    function createGarment(
        uint256 price,
        string memory title,
        string memory description,
        string memory size,
        string memory color,
        string memory fabric,
        string memory image
    ) external payable {
        require(msg.value >= cost, "Ether too low for minting!");
        require(msg.sender == owner(), "The owner of the marketplace cannot create NFT!");
        
        payTo(owner(), cost); // Pagamento della commissione al creatore del marketplace

        // Genero il nuovo ID per l'NFT
        germantIds.increment();
        uint256 newTokenId = germantIds.current();

        // Creo il nuovo NFT e lo assegno all'artista come proprietario
        _safeMint(msg.sender, newTokenId);

        GarmentDetails memory newGarment = GarmentDetails(
            newTokenId,
            msg.sender,
            msg.sender,
            price,
            title,
            description,
            size,
            color,
            fabric,
            image,
            block.timestamp
        );

        minted.push(newGarment);

        emit Sale(
            newTokenId,
            msg.sender,
            msg.sender,
            price,
            title,
            description,
            size,
            color,
            fabric,
            image,
            block.timestamp
        );
    }

    // sends ethers to a specific account
    function payTo(address to, uint256 amount) internal {
        address payable recipient = payable(address(to));
        recipient.transfer(amount); //Se la Transfer fallisce propaga errore e non va avanti
    }

    function purchaseGarment(uint256 tokenId) external payable {
        // Verifica che il token esiste
        require(_exists(tokenId), "Token does not exist");

        // Ottieni i dettagli del NFT
        GarmentDetails storage garment = minted[tokenId - 1];
        // Verifica che il prezzo pagato corrisponda al prezzo dell'indumento
        require(msg.value >= garment.price, "Ether too low for purchase!");
        // Verifica che il proprietario non può acquistare i propri NFT
        require(_isApprovedOrOwner(msg.sender, tokenId), "Operation Not Allowed!");

        // Calcola le commissioni per l'artista e il creatore del marketplace
        uint256 artistRoyalty;
        uint256 ownerAmount;
        if (garment.owner == garment.artist) {
            // L'owner è anche l'artista, l'artista riceve il prezzo intero
            artistRoyalty = 0;
            ownerAmount = garment.price;
        } else {
            // L'owner non è l'artista, l'artista riceve il 10% del prezzo e l'owner il resto
            artistRoyalty = (garment.price * artistRoyaltyPercentage) / 100;
            ownerAmount = garment.price - artistRoyalty;
        }

        // Effettua i pagamenti
        payTo(garment.owner, ownerAmount); // Pagamento all'owner
        payTo(garment.artist, artistRoyalty); // Pagamento della commissione all'artista

        // Trasferisco NFT
        _transfer(garment.owner, msg.sender, tokenId);

        //Aggiorno il nuovo proprietario del NFT
        garment.owner = msg.sender;
        minted[tokenId - 1] = garment;
        
        // Emetti l'evento di vendita
        emit Sale(
            minted[tokenId - 1].id,
            msg.sender,
            minted[tokenId - 1].artist,
            minted[tokenId - 1].price,
            minted[tokenId - 1].title,
            minted[tokenId - 1].description,
            minted[tokenId - 1].size,
            minted[tokenId - 1].color,
            minted[tokenId - 1].fabric,
            minted[tokenId - 1].image,
            minted[tokenId - 1].timestamp
        );
    }

    // changes the price of an NFT
    function changePrice(uint256 id, uint256 newPrice) external returns (bool) {
        require(newPrice > 0 ether, "Ether too low!");
        require(_isApprovedOrOwner(msg.sender, id), "Operation Not Allowed!");

        minted[id - 1].price = newPrice;
        return true;
    }

    // returns all minted NFTs
    function getAllNFTs() external view returns (GarmentDetails[] memory) {
        return minted;
    }

    // returns a specific NFT by token id
    function getNFT(uint256 id) external view returns (GarmentDetails memory) {
        return minted[id - 1];
    }

    function getGarmentsByOwner() external view returns (GarmentDetails[] memory) {
        uint256[] memory tokenIds = getTokenIdsByOwner(msg.sender);
        uint256 tokenCount = tokenIds.length;
        
        GarmentDetails[] memory garments = new GarmentDetails[](tokenCount);
        uint256 count = 0;

        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = tokenIds[i];
            GarmentDetails memory garment = minted[tokenId - 1];
        
            if (garment.owner == msg.sender) {
                garments[count] = garment;
                count++;
            }
        }
        
        return garments;
    }

    function getTokenIdsByOwner(address owner) private view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokenIds;
    }
    
}