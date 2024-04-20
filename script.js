import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';

const network = WalletAdapterNetwork.Mainnet;
const wallet = getPhantomWallet();

// Initialize the adapter with the chosen wallet and network
const walletAdapter = new WalletAdapter({
    wallet,
    network,
});
