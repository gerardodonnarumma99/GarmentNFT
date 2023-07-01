const Garment = artifacts.require("Garment.sol");

module.exports = function(deployer) {
  // Faccio il deploy del contratto Garment
  deployer.deploy(Garment, "GarmentContract", "GAR");
};