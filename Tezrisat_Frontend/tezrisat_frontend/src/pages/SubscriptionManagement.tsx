import { FC, useState } from "react";
// @ts-ignore
import { Button } from "@/components/ui/button";
// @ts-ignore
import { Input } from "@/components/ui/input";
// @ts-ignore
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Background from "../components/Background";
import Navigation from "../components/Navigation";
// @ts-ignore
import api from "../api";

const SubscriptionManagement: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [newPriceId, setNewPriceId] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const cancelSubscription = async () => {
    try {
      const res = await api.post("/api/cancel-subscription/", {
        subscription_id: subscriptionId,
      });
      setMessage(`Status: ${res.data.status}`);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to cancel");
    }
  };

  const updateSubscription = async () => {
    try {
      const res = await api.post("/api/update-subscription/", {
        subscription_id: subscriptionId,
        new_price_id: newPriceId,
      });
      setMessage(`Status: ${res.data.status}`);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to update");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-300 to-teal-500 text-gray-800">
      <Background />
      <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main
        className="flex-1 p-6 ml-20"
        style={{ marginLeft: isSidebarOpen ? 256 : 80 }}
      >
        <div className="max-w-md mx-auto mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Manage Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Subscription ID"
                value={subscriptionId}
                onChange={(e) => setSubscriptionId(e.target.value)}
              />
              <Input
                placeholder="New Price ID"
                value={newPriceId}
                onChange={(e) => setNewPriceId(e.target.value)}
              />
              <div className="flex space-x-2">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white" onClick={updateSubscription}>
                  Update
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={cancelSubscription}>
                  Cancel
                </Button>
              </div>
              {message && <p className="text-sm mt-2">{message}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionManagement;
