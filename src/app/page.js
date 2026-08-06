import { Navigation } from "./components/Navbar";
import HomePage from "./components/Home";
import Head from "next/head"



export default function Home() {
  return (
    <>
    <Head>
        {/* Open Graph (OG) Tags */}
 
    

   

      </Head>
      <div className="bg-zinc-950">
        <div className="fixed top-0 w-full  backdrop-blur-md bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49]  shadow-lg text-white py-2 text-center font-semibold font-mono z-40 px-2">
          <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl whitespace-normal sm:whitespace-nowrap px-1 sm:px-4">
            Powering the Future of Decentralized Predictions on Telegram
          </div>
        </div>        
        <Navigation />
        <div className="pt-24">
          <HomePage />
        </div>
      </div>
    </>
  );
}