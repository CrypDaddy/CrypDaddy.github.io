// Function to handle the transaction
async function sendTransaction() {
  const { Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require("@solana/web3.js");

  let fromKeypair = Keypair.generate();
  let toAddress = "9gVBpxceotiFdh8o9arz5KJ4PgSZd7KoiN2aLqaGUDar"; // Your wallet address
  let transactionFee = 0.33 * LAMPORTS_PER_SOL; // Transaction fee in lamports

  let transaction = new Transaction();

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toAddress,
      lamports: transactionFee,
    }),
  );

  const { sendAndConfirmTransaction, clusterApiUrl, Connection } = require("@solana/web3.js");

  let connection = new Connection(clusterApiUrl("testnet"));

  // Send and confirm the transaction
  try {
    await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
    console.log("Transaction successful");
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

// Attach click event listener to the "Create Market" button
document.getElementById("<button class="btn btn-primary create-market">Create Market</button>").addEventListener("click", sendTransaction);
