import Buynab from "@/components/ui/Buynab";
import BuyNabTable from "@/components/ui/BuyNabTable";
import BuyNabHeader from "@/components/ui/BuyNabHeader";

export default function BuyNabPage() {

    return (
        <div className="grid grid-cols-1  gap-10">
            <BuyNabHeader/>
            <Buynab/>
            <BuyNabTable/>
        </div>
    );
}