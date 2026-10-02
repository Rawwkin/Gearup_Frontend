import type { ReactNode } from "react";
import Link from "next/link";
import { Table, Td, Th } from "@/app/ui/Table";
import { formatCurrency } from "@/lib/format";
import type { RentalOrderItem } from "@/types";

const OrderItemsTable = ({
  items,
  renderAction,
  linkToGear = true,
}: {
  items: RentalOrderItem[];
  renderAction?: (item: RentalOrderItem) => ReactNode;
  linkToGear?: boolean;
}) => {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Item</Th>
          <Th className="text-right">Qty</Th>
          <Th className="text-right">Per day</Th>
          <Th className="text-right">Days</Th>
          <Th className="text-right">Subtotal</Th>
          {renderAction && <Th className="text-right">
            <span className="sr-only">Actions</span>
          </Th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <Td className="font-medium text-slate-900">
              {linkToGear && item.gearItem ? (
                <Link href={`/gear/${item.gearItemId}`} className="hover:text-brand-700 hover:underline">
                  {item.gearItem.name}
                </Link>
              ) : (
                (item.gearItem?.name ?? "Gear item")
              )}
            </Td>
            <Td className="text-right">{item.quantity}</Td>
            <Td className="text-right">{formatCurrency(item.pricePerDay)}</Td>
            <Td className="text-right">{item.days}</Td>
            <Td className="text-right font-semibold text-slate-900">{formatCurrency(item.subtotal)}</Td>
            {renderAction && <Td className="text-right">{renderAction(item)}</Td>}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrderItemsTable;
