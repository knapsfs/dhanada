import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faCircleCheck, faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function BlogContent() {
  return (
    <article className="bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 ">

        {/* Paragraphs */}
        <p className="text-gray-700 text-[18px] leading-[1.9] mb-8">
          The concept of wealth management has evolved significantly over the last decade. It is no longer just about accumulating assets; it is about building a robust financial framework that can withstand market volatility and be successfully passed down to future generations without severe tax implications or loss of value.
        </p>

        <p className="text-gray-700 text-[18px] leading-[1.9] mb-12">
          In this masterclass, we will explore the fundamental principles of constructing a multi-generational portfolio. Whether you are an entrepreneur looking to secure your family's future or a high-net-worth individual aiming for capital preservation, these strategies are essential for long-term success.
        </p>

        {/* H2 Heading */}
        <h2 className="text-3xl md:text-[36px] font-bold text-[#0a192f] mt-16 mb-8 leading-tight">
          1. The Importance of Asset Allocation
        </h2>

        <p className="text-gray-700 text-[18px] leading-[1.9] mb-8">
          Asset allocation is the cornerstone of any sound investment strategy. It involves dividing your investment portfolio among different asset categories, such as stocks, bonds, and cash. The process is not a one-size-fits-all approach; it depends heavily on your risk tolerance, investment timeline, and financial goals.
        </p>

        {/* Bullet List */}
        <ul className="space-y-4 mb-12 ml-4">
          <li className="flex items-start gap-4">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1.5" />
            <span className="text-gray-700 text-[18px] leading-[1.9]">
              <strong className="text-[#0a192f]">Equities for Growth:</strong> Over the long term, equities have historically provided the highest returns, helping to combat inflation.
            </span>
          </li>
          <li className="flex items-start gap-4">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1.5" />
            <span className="text-gray-700 text-[18px] leading-[1.9]">
              <strong className="text-[#0a192f]">Fixed Income for Stability:</strong> Bonds and other fixed-income securities provide regular income and act as a shock absorber during market downturns.
            </span>
          </li>
          <li className="flex items-start gap-4">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1.5" />
            <span className="text-gray-700 text-[18px] leading-[1.9]">
              <strong className="text-[#0a192f]">Alternative Assets:</strong> Real estate and private equity can offer diversification that isn't directly correlated with public markets.
            </span>
          </li>
        </ul>

        {/* Inline Highlighted Note Box (Blue) */}
        <div className="bg-[#eef5ff] border-l-4 border-[#032e92] p-8 rounded-r-2xl mb-12">
          <div className="flex items-center gap-3 mb-3 text-[#032e92]">
            <FontAwesomeIcon icon={faCircleInfo} className="text-xl" />
            <h4 className="font-bold text-lg m-0">Pro Tip for Investors</h4>
          </div>
          <p className="text-gray-700 text-[17px] leading-relaxed m-0">
            Rebalancing your portfolio annually ensures that your asset allocation stays aligned with your original targets. As certain assets grow faster than others, they can unintentionally increase your portfolio's risk profile.
          </p>
        </div>

        {/* H2 Heading */}
        <h2 className="text-3xl md:text-[36px] font-bold text-[#0a192f] mt-16 mb-8 leading-tight">
          2. Tax-Efficient Wealth Transfer
        </h2>

        <p className="text-gray-700 text-[18px] leading-[1.9] mb-8">
          Generating wealth is only half the battle. Preserving it across generations requires sophisticated tax planning. Without a proper estate plan, a significant portion of your hard-earned assets could be lost to taxes and legal fees during the transfer process.
        </p>

        {/* Blockquote */}
        <blockquote className="relative p-10 bg-gray-50 rounded-3xl border border-gray-100 my-12 text-center">
          <FontAwesomeIcon icon={faQuoteLeft} className="absolute top-6 left-8 text-4xl text-gray-200" />
          <p className="relative z-10 text-2xl text-[#0a192f] font-semibold italic leading-relaxed m-0">
            "The goal isn't just to make money; it's to create a lasting legacy. Tax efficiency is the invisible engine of multi-generational wealth."
          </p>
          <footer className="mt-6 text-gray-500 font-medium">— Saurabh Sharma, Senior Advisor</footer>
        </blockquote>

        {/* Warning Box (Red) */}
        <div className="bg-[#fff5f5] border-l-4 border-[#c10000] p-8 rounded-r-2xl mb-12">
          <div className="flex items-center gap-3 mb-3 text-[#c10000]">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-xl" />
            <h4 className="font-bold text-lg m-0">Important Warning</h4>
          </div>
          <p className="text-gray-700 text-[17px] leading-relaxed m-0">
            Avoid naming minors directly as beneficiaries for large insurance policies or investment accounts without setting up a trust. This can lead to complex legal hurdles and delayed access to funds.
          </p>
        </div>

        {/* H3 Heading */}
        <h3 className="text-2xl md:text-[28px] font-bold text-[#0a192f] mt-12 mb-6 leading-tight">
          Utilizing Trusts and Holding Companies
        </h3>

        <p className="text-gray-700 text-[18px] leading-[1.9] mb-12">
          Establishing a Family Trust or a Holding Company can provide a structured way to manage and distribute assets. These vehicles not only offer tax advantages but also protect assets from potential creditors and ensure that funds are distributed according to your specific wishes over time.
        </p>


        {/* H2 Heading */}
        <h2 className="text-3xl md:text-[36px] font-bold text-[#0a192f] mt-16 mb-8 leading-tight">
          Conclusion
        </h2>

        <p className="text-gray-700 text-[18px] leading-[1.9] mb-8">
          Building a multi-generational portfolio is a marathon, not a sprint. It requires continuous monitoring, a clear understanding of macroeconomic trends, and proactive tax planning. By focusing on diversification, disciplined rebalancing, and strategic estate planning, you can ensure that your wealth serves your family for decades to come.
        </p>

      </div>
    </article>
  );
}
