import type { Metadata } from "next";
import Container from "@/app/ui/Container";
import PageHeader from "@/app/ui/PageHeader";
import CartView from "@/app/ui/cart/CartView";

export const metadata: Metadata = { title: "Your cart" };

const CartPage = () => {
  return (
    <Container className="py-10">
      <PageHeader title="Your cart" description="Review your gear and rental dates before sending your request." />
      <CartView />
    </Container>
  );
};

export default CartPage;
