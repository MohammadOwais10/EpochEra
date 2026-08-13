"use client";
import { useState, useEffect } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    document.title = "FAQ - EpochEra Platform";
  }, []);

  const faqs = [
    {
      question: "What is the EpochEra platform?",
      answer: "EpochEra is a decentralized prediction market platform built on The Open Network (TON) blockchain. It allows users to create prediction markets, participate in forecasting outcomes, and earn rewards for accurate predictions. Our platform combines the power of blockchain technology with the accessibility of Telegram to make prediction markets easy and fun for everyone."
    },
    {
      question: "What is the difference between EpochEra and Epoch?",
      answer: "EpochEra is the name of the predictions market platform built on TON blockchain. The name of the Token is Epoch. EpochEra provides the infrastructure and platform, while Epoch is the native token used within the ecosystem for transactions, staking, governance, and rewards."
    },
    {
      question: "How does the prediction market work?",
      answer: "Users can create prediction markets on various topics (sports, crypto, politics, entertainment, etc.). Other users can then buy positions on different outcomes. When the event concludes, the smart contract automatically determines the winners and distributes rewards based on the initial odds and final outcome."
    },
    {
      question: "What blockchain is EpochEra built on?",
      answer: "EpochEra is built on the TON blockchain. Our smart contracts handle all prediction market logic, including position buying, outcome determination, and reward distribution in a trustless and transparent manner."
    },
    {
      question: "How do I participate in the presale?",
      answer: "To participate in the Epoch token presale, you'll need a compatible cryptocurrency wallet. Simply connect your wallet to our platform, select the amount of tokens you wish to purchase, and complete the transaction. Make sure you're not in a restricted jurisdiction before participating."
    },
    {
      question: "What can I do with Epoch tokens?",
      answer: "Epoch tokens have multiple utilities: participate in prediction markets, stake tokens to earn rewards, vote on governance proposals, receive fee discounts, and earn liquidity mining rewards by providing liquidity to DEX pools."
    },
    {
      question: "Is my investment safe?",
      answer: "While we implement robust security measures including audited smart contracts and secure development practices, cryptocurrency investments inherently carry risks. The value of tokens can fluctuate significantly, and you should only invest what you can afford to lose. Always do your own research and consider consulting with financial advisors."
    },
    {
      question: "How are rewards distributed?",
      answer: "Rewards are automatically distributed by smart contracts when prediction markets resolve. Winners receive their share of the pool based on their position and the odds. Additionally, token stakers receive regular yield from platform revenue, and liquidity providers earn trading fees."
    },
    {
      question: "What happens if a prediction market can't be resolved?",
      answer: "In rare cases where an outcome cannot be definitively determined (e.g., event cancellation), our governance system allows for community voting to determine the appropriate resolution. This ensures fairness and prevents funds from being locked indefinitely."
    },
    {
      question: "Can I create my own prediction markets?",
      answer: "Yes! Token holders can create custom prediction markets on topics of their choice. Market creators pay a small fee in Epoch tokens, and they may earn additional rewards if their market attracts significant participation and trading volume."
    },
    {
      question: "How does the referral program work?",
      answer: "Our referral program rewards users who bring new participants to the platform. When someone you refer makes their first purchase or participates in prediction markets, you earn a percentage of their activity as a commission. This helps grow our community while rewarding early adopters."
    },
    {
      question: "What are the fees?",
      answer: "EpochEra charges a small platform fee on prediction market transactions, typically 2-5% depending on the market type. Epoch token holders receive fee discounts, and a portion of fees is used for token buybacks and burns to benefit the entire ecosystem."
    },
    {
      question: "Is there a minimum investment?",
      answer: "Yes, there is a minimum investment amount for both the presale and prediction market participation to ensure efficient operation and cover gas costs. The minimum amounts are clearly displayed on the platform before you confirm any transaction."
    },
    {
      question: "How do I withdraw my funds?",
      answer: "You can withdraw your tokens and winnings at any time by connecting your wallet and initiating a withdrawal through our platform. Withdrawals are processed by smart contracts and typically complete within a few minutes, depending on network congestion."
    },
    {
      question: "What countries are restricted?",
      answer: "Due to regulatory requirements, we restrict access from certain jurisdictions including the United States, China, and other countries with strict cryptocurrency regulations. The full list of restricted countries is available in our Terms of Service."
    },
    {
      question: "How is the platform governed?",
      answer: "EpochEra uses decentralized governance where Epoch token holders can propose and vote on changes to the platform. This includes fee structures, new features, parameter adjustments, and other important decisions. The more tokens you hold, the more voting power you have."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="bg-background min-h-screen">
        <div className="fixed top-0 w-full backdrop-blur-md bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] shadow-lg text-white py-2 text-center font-semibold font-mono z-40 px-2">
          <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl whitespace-normal sm:whitespace-nowrap px-1 sm:px-4">
            Powering the Future of Decentralized Predictions on Telegram
          </div>
        </div>

        <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Frequently Asked <span className="text-[#EBD197]">Questions</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Everything you need to know about the EpochEra platform and Epoch tokens
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/30 rounded-lg border border-zinc-800 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-800/40 transition-colors"
                  >
                    <span className="text-white font-medium pr-4">{faq.question}</span>
                    <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                      <svg
                        className="w-4 h-4 text-[#EBD197]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-black/30 rounded-lg border border-zinc-800 p-6 sm:p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-3">Still have questions?</h3>
              <p className="text-gray-400 mb-6">
                Can't find the answer you're looking for? Please reach out to our community team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#EBD197] to-[#B48811] text-zinc-950 font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Join Our Community
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-zinc-500 text-sm">
              <p>Last Updated: August 2026</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
