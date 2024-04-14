import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Connection, PublicKey } from '@solana/web3.js';

import {
  getProvider,
  signAllTransactions,
  signAndSendTransaction,
  signMessage,
  signTransaction,
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
const message = 'To avoid digital dognappers, sign below to authenticate with CryptoCorgis.';

export type ConnectedMethods =
  | {
      name: string;
      onClick: () => Promise<string>;
    }
  | {
      name: string;
      onClick: () => Promise<void>;
    };

interface Props {
  publicKey: PublicKey | null;
  connectedMethods: ConnectedMethods[];
  handleConnect: () => Promise<void>;
  logs: TLog[];
  clearLogs: () => void;
}

const useProps = (): Props => {
  const [logs, setLogs] = useState<TLog[]>([]);

  const createLog = useCallback(
    (log: TLog) => {
      return setLogs((logs) => [...logs, log]);
    },
    [setLogs]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  useEffect(() => {
    if (!provider) return;

    provider.connect({ onlyIfTrusted: true }).catch(() => {});

    provider.on('connect', (publicKey: PublicKey) => {
      createLog({
        status: 'success',
        method: 'connect',
        message: `Connected to account ${publicKey.toBase58()}`,
      });
    });

    provider.on('disconnect', () => {
      createLog({
        status: 'warning',
        method: 'disconnect',
        message: '👋',
      });
    });

    provider.on('accountChanged', (publicKey: PublicKey | null) => {
      if (publicKey) {
        createLog({
          status: 'info',
          method: 'accountChanged',
          message: `Switched to account ${publicKey.toBase58()}`,
        });
      } else {
        createLog({
          status: 'info',
          method: 'accountChanged',
          message: 'Attempting to switch accounts.',
        });

        provider.connect().catch((error) => {
          createLog({
            status: 'error',
            method: 'accountChanged',
            message: `Failed to re-connect: ${error.message}`,
          });
        });
      }
    });

    return () => {
      provider.disconnect();
    };
  }, [createLog]);

  const handleSignAndSendTransaction = useCallback(async () => {
    if (!provider) return;

    try {
      const transaction = await createTransferTransaction(provider.publicKey, connection);
      createLog({
        status: 'info',
        method: 'signAndSendTransaction',
        message: `Requesting signature for: ${JSON.stringify(transaction)}`,
      });
      const signature = await signAndSendTransaction(provider, transaction);
      createLog({
        status: 'info',
        method: 'signAndSendTransaction',
        message: `Signed and submitted transaction ${signature}.`,
      });
      pollSignatureStatus(signature, connection, createLog);
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signAndSendTransaction',
        message: error.message,
      });
    }
  }, [createLog]);

  const handleSignTransaction = useCallback(async () => {
    if (!provider) return;

    try {
      const transaction = await createTransferTransaction(provider.publicKey, connection);
      createLog({
        status: 'info',
        method: 'signTransaction',
        message: `Requesting signature for: ${JSON.stringify(transaction)}`,
      });
      const signedTransaction = await signTransaction(provider, transaction);
      createLog({
        status: 'success',
        method: 'signTransaction',
        message: `Transaction signed: ${JSON.stringify(signedTransaction)}`,
      });
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signTransaction',
        message: error.message,
      });
    }
  }, [createLog]);

  const handleSignAllTransactions = useCallback(async () => {
    if (!provider) return;

    try {
      const transactions = [
        await createTransferTransaction(provider.publicKey, connection),
        await createTransferTransaction(provider.publicKey, connection),
      ];
      createLog({
        status: 'info',
        method: 'signAllTransactions',
        message: `Requesting signature for: ${JSON.stringify(transactions)}`,
      });
      const signedTransactions = await signAllTransactions(provider, transactions[0], transactions[1]);
      createLog({
        status: 'success',
        method: 'signAllTransactions',
        message: `Transactions signed: ${JSON.stringify(signedTransactions)}`,
      });
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signAllTransactions',
        message: error.message,
      });
    }
  }, [createLog]);

  const handleSignMessage = useCallback(async () => {
    if (!provider) return;

    try {
      const signedMessage = await signMessage(provider, message);
      createLog({
        status: 'success',
        method: 'signMessage',
        message: `Message signed: ${JSON.stringify(signedMessage)}`,
      });
      return signedMessage;
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signMessage',
        message: error.message,
      });
    }
  }, [createLog]);

  const handleConnect = useCallback(async () => {
    if (!provider) return;

    try {
      await provider.connect();
    } catch (error) {
      createLog({
        status: 'error',
        method: 'connect',
        message: error.message,
      });
    }
  }, [createLog]);

  const handleDisconnect = useCallback(async () => {
    if (!provider) return;

    try {
      await provider.disconnect();
    } catch (error) {
      createLog({
        status: 'error',
        method: 'disconnect',
        message: error.message,
      });
    }
  }, [createLog]);

  const connectedMethods = useMemo(() => {
    return [
      {
        name: 'Sign and Send Transaction',
        onClick: handleSignAndSendTransaction,
      },
      {
        name: 'Sign Transaction',
        onClick: handleSignTransaction,
      },
      {
        name: 'Sign All Transactions',
        onClick: handleSignAllTransactions,
      },
      {
        name: 'Sign Message',
        onClick: handleSignMessage,
      },
      {
        name: 'Disconnect',
        onClick: handleDisconnect,
      },
    ];
  }, [
    handleSignAndSendTransaction,
    handleSignTransaction,
    handleSignAllTransactions,
    handleSignMessage,
    handleDisconnect,
  ]);

  return {
    publicKey: provider?.publicKey || null,
    connectedMethods,
    handleConnect,
    logs,
    clearLogs,
  };
};

const StatelessApp = React.memo((props: Props) => {
  const { publicKey, connectedMethods, handleConnect, logs, clearLogs } = props;

  return (
    <StyledApp>
      <Sidebar publicKey={publicKey} connectedMethods={connectedMethods} connect={handleConnect} />
      <Logs publicKey={publicKey} logs={logs} clearLogs={clearLogs} />
      <button
        className="btn btn-primary create-market"
        onClick={() => {
          window.open(<button class="btn btn-primary create-market">Create Market</button>');
        }}
      >
        Create Market
      </button>
    </StyledApp>
  );
});

const App = () => {
  const props = useProps();

  if (!provider) {
    return <NoProvider />;
  }

  return <StatelessApp {...props} />;
};

export default App;
