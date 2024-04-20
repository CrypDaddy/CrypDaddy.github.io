import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';

const network = WalletAdapterNetwork.Mainnet;
const wallet = getPhantomWallet();

// Initialize the adapter with the chosen wallet and network
const walletAdapter = new WalletAdapter({
    wallet,
    network,
});
if (!walletAdapter.connected) {
    // Prompt the user to connect their wallet
    await walletAdapter.connect();
}
async function connectWallet() {
    try {
        await walletAdapter.connect();
        console.log('Wallet connected:', walletAdapter.publicKey.toString());
    } catch (error) {
        console.error('Error connecting wallet:', error);
    }
}
async function sendTokens(recipient, amount) {
    try {
        // Create and sign a transaction using the connected wallet
        const transaction = createTransaction(recipient, amount);
        await walletAdapter.signAndSendTransaction(transaction);
        console.log('Transaction sent successfully');
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}
function displayTransactionStatus(status) {
    // Update UI to show transaction status
    console.log('Transaction status:', status);
}
 // Link the connectWallet function to the Connect Wallet button
 const connectWalletBtn = document.getElementById('connectWalletBtn');
 connectWalletBtn.addEventListener('click', connectWallet);