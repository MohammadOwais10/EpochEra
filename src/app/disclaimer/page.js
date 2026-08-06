import { Navigation } from "../components/Navbar";
import Head from "next/head";

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer - EpochEra</title>
        <meta name="description" content="Disclaimer for EpochEra" />
      </Head>
      <div className="bg-zinc-950 min-h-screen">
        <div className="fixed top-0 w-full  backdrop-blur-md bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49]  shadow-lg text-white py-2 text-center font-semibold font-mono z-40 px-2">
          <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl whitespace-normal sm:whitespace-nowrap px-1 sm:px-4">
            Powering the Future of Decentralized Predictions on Telegram
          </div>
        </div>
        <Navigation />
        <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 sm:p-8 md:p-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
                IMPORTANT NOTICE
              </h1>
              
              <p className="text-[#EBD197] font-semibold mb-6">
                PLEASE READ THIS DISCLAIMER IN ITS ENTIRETY BEFORE PARTICIPATING IN THE EpochEra TOKEN PRESALE OR USING THIS WEBSITE.
              </p>

              <div className="space-y-6 text-gray-400 leading-relaxed">
                <div>
                  <h4 className="text-white font-semibold mb-2">1. Not Financial or Investment Advice</h4>
                  <p className="text-sm">The information provided on this website, in the whitepaper, or through any associated social media channels does not constitute investment advice, financial advice, trading advice, or any other sort of advice. You should not treat any of the website's content as such. Participation in the Epochera token presale is strictly voluntary. You should conduct your own due diligence and consult with financial, legal, and tax advisors before making any purchase decisions.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">2. High Risk & Loss of Capital</h4>
                  <p className="text-sm">Cryptocurrency investments are highly volatile and speculative. Participating in a token presale carries an extreme level of risk, including the potential loss of all invested capital. No Guaranteed Value: EpochEra tokens have no guaranteed monetary or market value. Price Volatility: Cryptocurrency markets experience severe price fluctuations driven by global sentiment, regulatory developments, and market liquidity. Speculative Asset: Future utility, adoption, or secondary market liquidity cannot be guaranteed.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">3. Restricted Jurisdictions & Compliance</h4>
                  <p className="text-sm">This presale is NOT directed to, or intended for distribution to or use by, any person or entity who is a citizen, resident of, or located in any jurisdiction where such distribution, publication, availability, or use would be contrary to applicable laws or regulations. Restricted regions typically include, but are not limited to: The United States of America (including its territories), People's Republic of China, Sanctioned countries under OFAC, EU, or UN guidelines (e.g., Iran, North Korea, Syria, Cuba, Crimea region). By connecting your wallet or purchasing EpochEra tokens, you represent and warrant that you are legally permitted to do so under the laws of your jurisdiction and that you are not a resident or citizen of any restricted area.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">4. Forward-Looking Statements</h4>
                  <p className="text-sm">This website and whitepaper contain forward-looking statements regarding project milestones, product development, token utility, roadmap goals, and future integrations. These statements are based on current expectations and projections and are subject to significant technical, market, and operational uncertainties. Actual outcomes may differ materially from those projected.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">5. Smart Contract & Technical Risks</h4>
                  <p className="text-sm">Blockchain Security: While smart contracts are built and tested, blockchain technology is subject to inherent security risks, including bugs, exploits, cyberattacks, or unexpected network failures on the underlying blockchain platform. Irreversible Transactions: All token transactions are final and irreversible. The project team accepts no responsibility for funds sent to incorrect addresses or loss of private keys.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">6. Regulatory & Legal Uncertainty</h4>
                  <p className="text-sm">The regulatory framework governing cryptocurrencies, initial coin offerings (ICOs), token presales, and digital assets is evolving rapidly across global jurisdictions. Future regulatory actions, laws, or enforcement measures may restrict, alter, or prohibit the operational capacity of the EpochEra ecosystem or reduce the utility of EpochEra Token.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">7. Limitation of Liability</h4>
                  <p className="text-sm">To the maximum extent permitted by applicable law, EpochEra, its founders, team members, advisors, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages—including loss of profits, data, or goodwill—arising out of or in connection with your participation in the presale or use of this website.</p>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <p className="text-sm">
                    <span className="text-[#EBD197] font-semibold">Acknowledgment:</span> By creating an account on this website, you confirm that you have read, understood, and agreed to the full terms of this disclaimer and accept all risks associated with token presale participation.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-zinc-500 text-sm">
                <p>Last Updated: August 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
