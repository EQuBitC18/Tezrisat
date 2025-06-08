import { FC, useEffect, useState } from "react";
import api from "../api";
import Background from "../components/Background";
import Navigation from "../components/Navigation";

const Billing: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToStripe = async () => {
      try {
        const res = await api.get(`/api/profile/`);
        const email = res.data.email;
        const stripePortal =
          "https://billing.stripe.com/p/login/test_dRm9AMe2c1bw4wd1fK5ZC00?prefilled_email=" +
          encodeURIComponent(email);
        window.location.href = stripePortal;
      } catch (err) {
        // In case of failure just send to portal without email
        window.location.href =
          "https://billing.stripe.com/p/login/test_dRm9AMe2c1bw4wd1fK5ZC00";
      } finally {
        setLoading(false);
      }
    };

    redirectToStripe();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-300 to-teal-500 text-gray-800">
      <Background />
      <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 p-6 ml-20" style={{ marginLeft: isSidebarOpen ? 256 : 80 }}>
        {loading && <p className="text-xl">Redirecting to billing portal...</p>}
      </main>
    </div>
  );
};

export default Billing;
