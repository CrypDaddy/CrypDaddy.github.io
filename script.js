// Initialize Phantom Wallet
const solanaWallet = new WalletAdapter(window.solana);

// Function to handle the Phantom Wallet button click
document.getElementById('connectPhantomBtn').addEventListener('click', function() {
    // Connect to Phantom Wallet
    solanaWallet.connect().then(() => {
        console.log('Connected to Phantom Wallet');
    }).catch((error) => {
        console.error('Failed to connect to Phantom Wallet', error);
    });
});
