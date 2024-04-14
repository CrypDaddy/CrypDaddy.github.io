const solanaWeb3 = require("@solana/web3.js");
console.log(solanaWeb3);
import * as solanaWeb3 from "@solana/web3.js";
console.log(solanaWeb3);
// Import the Keypair class from the @solana/web3.js library
const { Keypair } = require("@solana/web3.js");

// Generate a new Keypair
let keypair = Keypair.generate();

// Log the generated keypair to the console
console.log(keypair);
