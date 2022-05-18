const { deployContract } = require('./deploy.js');

async function main() {
  const greeter = await deployContract("TestToken", ["TestToken", "TST"])

  console.log("TestToken deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
