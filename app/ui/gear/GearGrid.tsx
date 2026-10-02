import GearCard from "@/app/ui/gear/GearCard";
import type { GearItem } from "@/types";

const GearGrid = ({ items }: { items: GearItem[] }) => {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((gear) => (
        <li key={gear.id}>
          <GearCard gear={gear} />
        </li>
      ))}
    </ul>
  );
};

export default GearGrid;
