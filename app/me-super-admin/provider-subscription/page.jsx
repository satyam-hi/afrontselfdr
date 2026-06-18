"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const backendBase = process.env.NEXT_PUBLIC_BACKEN_BASE_URL || "";
const apiUrl = (path) => {
  if (backendBase) {
    return `${backendBase}${path}`;
  }
  return path;
};

export default function ProviderSubscriptionPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [error, setError] = useState("");
  const [amountValue, setAmountValue] = useState("499");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(apiUrl("/api/providers/providers?limit=100"));
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to load providers");
      }
      setProviders(data.providers || []);
    } catch (err) {
      setError(err.message || "Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  const performAction = async (sprovid, endpoint, body) => {
    setLoading(true);
    setError("");
    setActionMessage("");
    try {
      const response = await fetch(apiUrl(`/api/providers/${endpoint}/${sprovid}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Action failed");
      }
      setActionMessage(data.message || "Action completed successfully");
      await fetchProviders();
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const subscribeProvider = async (sprovid) => {
    await performAction(sprovid, "subscribe", {
      plan: "monthly",
      amount: amountValue,
      currency: "INR",
    });
  };

  const renewProvider = async (sprovid) => {
    await performAction(sprovid, "renew-subscription", {});
  };

  const cancelProvider = async (sprovid) => {
    await performAction(sprovid, "cancel-subscription", {});
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Provider Subscription Management</h1>
            <p className="text-gray-600 mt-2">
              View providers, start monthly subscriptions, renew recurring payments, and cancel subscriptions from one place.
            </p>
          </div>
          <Link href="/admin" className="rounded-full bg-black text-white px-5 py-3 text-sm font-semibold hover:bg-gray-900">
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Subscription Amount</h2>
            <p className="text-sm text-gray-500 mb-3">
              Set the monthly amount for new subscriptions. Existing providers keep their current plan values.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Amount</label>
            <input
              value={amountValue}
              onChange={(event) => setAmountValue(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
              placeholder="Enter amount"
            />
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Quick Tips</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Click Subscribe to activate monthly billing.</li>
              <li>• Renew will move the next billing date forward one month.</li>
              <li>• Cancel stops recurring billing and deactivates the subscription.</li>
            </ul>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 mb-6">{error}</div>
        ) : null}

        {actionMessage ? (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-green-700 mb-6">{actionMessage}</div>
        ) : null}

        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Provider</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Subscription</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Next Billing</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {providers.map((provider) => {
                const subscription = provider.subscription || {};
                const isActive = subscription.active && subscription.status === "active";
                return (
                  <tr key={provider.sprovid}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{provider.name || provider.sprovid}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{provider.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                        {subscription.status || "inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.active ? `${subscription.plan} • ${subscription.currency} ${subscription.amount}` : "No active subscription"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 space-y-2">
                      <button
                        onClick={() => subscribeProvider(provider.sprovid)}
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 px-3 py-2 text-white text-sm font-semibold hover:bg-blue-700 transition"
                      >
                        Subscribe
                      </button>
                      <button
                        onClick={() => renewProvider(provider.sprovid)}
                        disabled={!isActive || loading}
                        className="w-full rounded-xl bg-emerald-600 px-3 py-2 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:bg-gray-300 disabled:text-gray-600"
                      >
                        Renew
                      </button>
                      <button
                        onClick={() => cancelProvider(provider.sprovid)}
                        disabled={!isActive || loading}
                        className="w-full rounded-xl bg-red-600 px-3 py-2 text-white text-sm font-semibold hover:bg-red-700 transition disabled:bg-gray-300 disabled:text-gray-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
              {providers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    No provider data available.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
