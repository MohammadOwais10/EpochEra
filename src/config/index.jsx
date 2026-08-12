import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { AppKitNetwork, bscTestnet } from "@reown/appkit/networks";


// Get projectId from https://dashboard.reown.com

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '536a4e0f31c73628bf4187a9c171c2ad';

if (!projectId) {
    throw new Error('Project ID is not defined')
}

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
