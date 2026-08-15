import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { bscTestnet } from "@reown/appkit/networks";

// Get a free project ID from https://cloud.reown.com
// Add NEXT_PUBLIC_PROJECT_ID to your .env.local or .env file to override this fallback
export const projectId = '96770219ede5aa5dc5cba1e98c7cf7d5';

export const networks = [bscTestnet];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks,
      transports: {
        [bscTestnet.id]: http(
          "https://bsc-testnet-rpc.publicnode.com"
        ),
      },
})

export const config = wagmiAdapter.wagmiConfig
