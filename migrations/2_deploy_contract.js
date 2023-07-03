const Garment = artifacts.require("Garment.sol");

module.exports = function(deployer, network, accounts) {
  // Faccio il deploy del contratto Garment e imposto l'indirizzo del proprietario
  console.log('OWNER:', accounts[0])
  deployer.deploy(Garment, "GarmentContract", "GAR", { from: accounts[0] });
};