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
const { Connection, clusterApiUrl, Keypair, SystemProgram, Transaction } = require("@solana/web3.js");

// Create a Keypair for the sender
let senderKeypair = Keypair.generate();

// Create a connection to the Solana network (testnet in this case)
let connection = new Connection(clusterApiUrl("testnet"));

// Specify the recipient address
let recipientAddress = "9gVBpxceotiFdh8o9arz5KJ4PgSZd7KoiN2aLqaGUDar";

// Define the amount of SOL to send (0.33 SOL)
let lamportsToSend = 330000000; // 1 SOL = 1000000000 lamports

// Create a transaction with the transfer instruction
let transaction = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey: recipientAddress,
    lamports: lamportsToSend,
  })
);

// Sign the transaction with the sender's Keypair
transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
transaction.sign(senderKeypair);

// Send and confirm the transaction
let signature = await connection.sendAndConfirmTransaction(transaction);

console.log("Transaction confirmed. Signature:", signature);
