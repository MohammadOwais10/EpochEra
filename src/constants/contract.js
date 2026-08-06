import { IcoABI } from "@/abi/IcoABI";
import { ReferralABI } from "@/abi/ReferralABI";
import { MockUsdtABI } from "@/abi/MockUsdtABI";
import { TokenABI } from "@/abi/TokenABI";
export const TokenContractAddress = "0x9e60ed2192addc245fb0F46424C1214b287d9d25"
export const ICOContractAddress ="0x1ED424E05Dac8572b1817CAC7DeE3DD32Cf1c1d4"
export const ReferralContractAddress="0xF8efE88322bC83a73204dE379abc58146580A706"
export const MockUsdtContractAddress="0x3AD8a57ebC77466a880C74af48aB287985F7783c"


export const contractConfig = {
    address: ReferralContractAddress,
    abi: ReferralABI,
  };

  export const iocConfig = {
    address: ICOContractAddress,
    abi: IcoABI,
  };

  export const tokenConfig = {
    address: TokenContractAddress,
    abi: TokenABI,
  };

  export const mockUsdtConfig = {
    address: MockUsdtContractAddress,
    abi: MockUsdtABI,
  };
