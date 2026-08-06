'use client';
import { memo, useCallback } from 'react';
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import Button from './Button';

const Header = memo(() => {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { address } = useAppKitAccount();

  const handleWalletAction = useCallback(async () => {
    try {
      if (address) {
        await disconnect();
      } else {
        await open();
      }
    } catch (error) {
      console.error('Wallet action failed:', error);
    }
  }, [address, disconnect, open]);

  return (
    <header className="w-full ">
      <div className="flex items-center  justify-end md:justify-between gap-3 w-full md:px-4 md:py-3">
      
          <div className="text-base sm:text-lg text-zinc-300 flex items-center font-medium font-mono">
            <span className="hidden sm:inline mr-2">Wallet connected:</span>
            {address ? <appkit-account-button balance="hide" /> :   <span className="text-white">None</span>}
          </div>
      
        <Button 
          variant="primary" 
          size="lg" 
          className="rounded-full min-w-[140px] text-sm sm:text-base hidden md:block"
          onClick={handleWalletAction}
          aria-label={address ? "Disconnect Wallet" : "Connect Wallet"}
        >
          {address ? "Disconnect" : "Connect Wallet"}
        </Button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
