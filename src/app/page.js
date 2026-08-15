import HomePage from "./components/Home";
import Head from "next/head"
import PublicHeader from "@/components/PublicHeader"

export default function Home() {
  return (
    <>
      <Head>
        {/* Open Graph (OG) Tags */}
      </Head>
      <div className="bg-background">
        <PublicHeader />

        <div className="pt-24">
          <HomePage />
        </div>
      </div>
    </>
  );
}