import { Navigation } from "../components/Navbar";
import Head from "next/head";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - EpochEra Platform</title>
        <meta name="description" content="Terms of Service for EpochEra platform and Epoch tokens" />
      </Head>
      <div className="bg-backgrounds min-h-screen">
        <div className="fixed top-0 w-full backdrop-blur-md bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] shadow-lg text-white py-2 text-center font-semibold font-mono z-40 px-2">
          <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl whitespace-normal sm:whitespace-nowrap px-1 sm:px-4">
            Powering the Future of Decentralized Predictions on Telegram
          </div>
        </div>
        <Navigation />
        <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6 sm:p-8 md:p-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
                Terms of Service
              </h1>

              <p className="text-[#EBD197] font-semibold mb-6">
                PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE USING THE EpochEra PLATFORM OR INTERACTING WITH EPOCH TOKENS.
              </p>

              <div className="space-y-6 text-gray-400 leading-relaxed">
                <div>
                  <h4 className="text-white font-semibold mb-2">1. Acceptance of Terms</h4>
                  <p className="text-sm">By accessing or using the EpochEra platform, website, or services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Services. These Terms constitute a legally binding agreement between you and EpochEra. EpochEra is the platform name and Epoch is the token name.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">2. Eligibility and Restrictions</h4>
                  <p className="text-sm">You must be at least 18 years old to use the Services. By using the Services, you represent and warrant that you are of legal age to form a binding contract with EpochEra. The Services are not available to residents or citizens of restricted jurisdictions, including but not limited to the United States, China, and countries subject to OFAC sanctions. You are responsible for compliance with all applicable laws in your jurisdiction.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">3. Account Security</h4>
                  <p className="text-sm">You are solely responsible for maintaining the security of your wallet, private keys, and account credentials. EpochEra is not responsible for any loss or damage arising from your failure to protect your account information. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">4. Acceptable Use</h4>
                  <p className="text-sm">You agree to use the Services only for lawful purposes and in accordance with these Terms. You may not: (a) use the Services for any illegal purpose; (b) attempt to gain unauthorized access to the Services or related systems; (c) interfere with or disrupt the Services; (d) use automated scripts to abuse the Services; (e) attempt to manipulate prediction markets or engage in fraudulent activities; (f) use the Services to violate any applicable laws or regulations.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">5. Prediction Markets</h4>
                  <p className="text-sm">When creating or participating in prediction markets, you agree to abide by all market-specific rules and terms. Market creators are responsible for providing accurate and fair market conditions. Participants acknowledge that prediction outcomes are determined by smart contracts and oracle systems, and these determinations are final. EpochEra reserves the right to suspend or terminate markets that violate these Terms or applicable laws.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">6. Epoch Token Ownership and Transactions</h4>
                  <p className="text-sm">You acknowledge that all Epoch token transactions are recorded on a public blockchain and are irreversible. You are the sole owner of tokens in your wallet and are responsible for all transactions initiated from your wallet. EpochEra does not guarantee the value, liquidity, or marketability of any tokens. Token purchases are non-refundable except as required by applicable law.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">7. Fees and Payments</h4>
                  <p className="text-sm">EpochEra charges fees for certain Services, including platform fees on prediction markets and transaction processing fees. You agree to pay all applicable fees. Fee schedules are available on the platform and may be updated from time to time. EpochEra reserves the right to modify fees with reasonable notice.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">8. Intellectual Property</h4>
                  <p className="text-sm">All content, features, and functionality of the Services, including but not limited to text, graphics, logos, software, and code, are the exclusive property of EpochEra or its licensors and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, modify, distribute, or create derivative works of any content without prior written consent.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">9. Disclaimers and Warranties</h4>
                  <p className="text-sm">THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. EpochEra DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. We do not guarantee that the Services will be uninterrupted, secure, or error-free.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">10. Limitation of Liability</h4>
                  <p className="text-sm">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, EpochEra SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES. IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID FOR THE SERVICES IN THE TWELVE MONTHS PRECEDING THE CLAIM.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">11. Indemnification</h4>
                  <p className="text-sm">You agree to indemnify, defend, and hold harmless EpochEra, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Services, violation of these Terms, or infringement of any third-party rights.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">12. Governing Law and Dispute Resolution</h4>
                  <p className="text-sm">These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles. Any disputes arising under these Terms shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization], and you waive your right to a trial by jury.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">13. Modifications to Terms</h4>
                  <p className="text-sm">EpochEra reserves the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on the platform and updating the "Last Updated" date. Your continued use of the Services after such modifications constitutes your acceptance of the updated Terms.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">14. Termination</h4>
                  <p className="text-sm">EpochEra may suspend or terminate your access to the Services at any time, with or without cause, with or without notice. Upon termination, your right to use the Services will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, and limitations of liability.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">15. Severability</h4>
                  <p className="text-sm">If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the remaining Terms remain in full force and effect.</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">16. Entire Agreement</h4>
                  <p className="text-sm">These Terms constitute the entire agreement between you and EpochEra regarding the Services and supersede all prior agreements, communications, and understandings. These Terms prevail over any conflicting terms in any purchase order or other document you submit.</p>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <p className="text-sm">
                    <span className="text-[#EBD197] font-semibold">Contact:</span> If you have questions about these Terms, please contact us at [contact@epochera.com]
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-zinc-500 text-sm">
                <p>Last Updated: August 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
