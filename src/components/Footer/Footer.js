import getStripe from "../../lib/getStripe";
import "./Footer.css";

const Footer = () => {
  async function handleCheckout() {
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: process.env.REACT_APP_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      successUrl: `http://localhost:3000/success`,
      cancelUrl: `http://localhost:3000`,
      customerEmail: "customer@email.com",
    });
    console.warn(error.message);
  }

  return (
    <>
      <div className="footer">
        <button className="footer-element" onClick={handleCheckout}>
          Pricing
        </button>
      </div>
    </>
  );
};
export default Footer;
