import { FC, useState } from "react";
import api from "../api";
// @ts-ignore
import { Button } from "@/components/ui/button";
// @ts-ignore
import { Input } from "@/components/ui/input";
// @ts-ignore
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Background from "../components/Background";
import Navigation from "../components/Navigation";

const SubscriptionManagement: FC = () => {
  const [subscriptionId, setSubscriptionId] = useState("");
  const [newPriceId, setNewPriceId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/api/cancel-subscription/`, {
        subscription_id: subscriptionId,
      });
      setStatusMessage(res.data.status || "Cancelled");
    } catch (err: any) {
      setStatusMessage(err.message || "Error cancelling subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/api/update-subscription/`, {
        subscription_id: subscriptionId,
        new_price_id: newPriceId,
      });
      setStatusMessage(res.data.status || "Updated");
    } catch (err: any) {
      setStatusMessage(err.message || "Error updating subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-300 to-teal-500 text-gray-800">
      <Background />
      <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 p-6 ml-20" style={{ marginLeft: isSidebarOpen ? 256 : 80 }}>
        <Card className="max-w-lg mx-auto bg-white/40 backdrop-blur-sm shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-2xl text-teal-900">Manage Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subid" className="text-teal-800">Subscription ID</label>
              <Input
                id="subid"
                value={subscriptionId}
                onChange={(e) => setSubscriptionId(e.target.value)}
                className="bg-white/20 w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="priceid" className="text-teal-800">New Price ID</label>
              <Input
                id="priceid"
                value={newPriceId}
                onChange={(e) => setNewPriceId(e.target.value)}
                className="bg-white/20 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCancel} disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
                Update
              </Button>
            </div>
            {statusMessage && (
              <p className="text-teal-900 font-semibold">{statusMessage}</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SubscriptionManagement;
