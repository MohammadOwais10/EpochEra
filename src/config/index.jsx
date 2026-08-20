import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { bsc, bscTestnet } from "@reown/appkit/networks";
import { bsc as bscViem, bscTestnet as bscTestnetViem } from 'viem/chains'

// Pick BSC network from .env.local (Next.js replaces these at build time).
// Use NEXT_PUBLIC_BSC_NETWORK=mainnet or NEXT_PUBLIC_BSC_NETWORK=testnet
const bscNetwork = (process.env.NEXT_PUBLIC_BSC_NETWORK ?? 'testnet').toLowerCase();
const isMainnet = bscNetwork === 'mainnet' || bscNetwork === 'bsc-mainnet';

export const activeNetwork = isMainnet ? bsc : bscTestnet;
export const activeViemChain = isMainnet ? bscViem : bscTestnetViem;
export const chainIdHex = isMainnet ? '0x38' : '0x61';
export const networkName = isMainnet ? 'BSC Mainnet' : 'BSC Testnet';
export const nativeSymbol = isMainnet ? 'BNB' : 'tBNB';
export const defaultRpc = isMainnet ? 'https://bsc-rpc.publicnode.com' : 'https://bsc-testnet-rpc.publicnode.com';
export const rpcUrl = process.env.NEXT_PUBLIC_BSC_RPC_URL ?? defaultRpc;
export const blockExplorer = isMainnet ? 'https://bscscan.com' : 'https://testnet.bscscan.com';

// Get a free project ID from https://cloud.reown.com
// Add NEXT_PUBLIC_PROJECT_ID to your .env.local or .env file to override this fallback
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? '96770219ede5aa5dc5cba1e98c7cf7d5';

export const networks = [activeNetwork];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks,
    transports: {
      [activeNetwork.id]: http(rpcUrl),
    },
})

export const config = wagmiAdapter.wagmiConfig
