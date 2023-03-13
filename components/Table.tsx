import { CheckIcon } from "@heroicons/react/outline";
import { Product } from "@stripe/firestore-stripe-payments";

interface Props {
    products: Product[];
    selectedPlan: Product | null;
  }

function Table({ products, selectedPlan }: Props) {
  return (
    <table>
        <tbody className="divide-y divide-[gray]">

            {/* Row for monthly price */}
            <tr className="tableRow">
                <td className="tableDataTitle">Monthly price</td>
                {products.map((product) => (
                    <td key={product.id} className={`tableDataFeature ${
                        selectedPlan?.id === product.id 
                        ? "text-[#e50914]"
                        : "text-[gray]"}`}>
                         ${product.prices[0].unit_amount! / 100}
                         {/* ! for Typescript protection. Without it will get object is possibly null but we konw it must exist because we made the product in Stripe. Divide by 100 to get correct currency number */}
                    </td>
                ))}
            </tr>

            {/* Row for video quality */}
            <tr className="tableRow">
                <td className="tableDataTitle">Video quality</td>
                {products.map((product) => (
                    <td key={product.id} className={`tableDataFeature ${selectedPlan?.id === product.id ? "text-[#e50914]":"text-[gray]"}`}>
                         {product.metadata.videoQuality}
                    </td>
                ))}
            </tr>

                    {/* Row for resolution */}
            <tr className="tableRow">
          <td className="tableDataTitle">Resolution</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? 'text-[#E50914]'
                  : 'text-[gray]'
              }`}
              key={product.id}
            >
              {product.metadata.resolution}
            </td>
          ))}
        </tr>

        {/* Row for portability */}
        <tr className="tableRow">
          <td className="tableDataTitle">
            Watch on your TV, computer, mobile phone and tablet
          </td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? 'text-[#E50914]'
                  : 'text-[gray]'
              }`}
              key={product.id}
            >
              {product.metadata.portability === 'true' && (
                <CheckIcon className="inline-block h-8 w-8" />
              )}
            </td>
          ))}
        </tr>

        </tbody>
    </table>
  )
}

export default Table