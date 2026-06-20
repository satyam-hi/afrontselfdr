"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const backendBase = process.env.NEXT_PUBLIC_BACKEN_BASE_URL || "";

export default function ProviderSubscriptionPurchasePage() {
  const router = useRouter();
  const [providerId, setProviderId] = useState(null);
  const [providerData, setProviderData] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [plans] = useState([
    { id: "basic", name: "Basic", price: 244, features: ["Add products", "Best analytics", "Email support"] },
    { id: "pro", name: "Professional", price: 444, features: ["Add Unlimited products", "Advanced analytics", "Priority support", "Custom Qr Codes"] },
    // { id: "enterprise", name: "Enterprise", price: 1999, features: ["Everything in Pro", "API access", "Dedicated account manager", "Custom integrations"] },
  ]);

  const [selectedPlan, setSelectedPlan] = useState("pro");

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Fetch provider data and subscription
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setLoading(true);
        setError("");

        // Get provider ID from cookies
        const cookiesRes = await fetch("/api/cookies", { cache: "no-store" });
        const cookieData = await cookiesRes.json();

        if (!cookieData.id) {
          throw new Error("Provider ID not found in cookies");
        }

        setProviderId(cookieData.id);

        // Fetch provider data
        const providerRes = await fetch(
          `${backendBase}/api/providers/provider/${cookieData.id}`
        );
        const providerDataResponse = await providerRes.json();

        if (providerDataResponse.success) {
          setProviderData(providerDataResponse.provider);
        }

        // Fetch subscription data
        const subscriptionRes = await fetch(
          `${backendBase}/api/providers/subscription/${cookieData.id}`
          
        );
        const subscriptionResponse = await subscriptionRes.json();

        if (subscriptionResponse.success) {
          setSubscription(subscriptionResponse.subscription);
        }
      } catch (err) {
        setError(err.message || "Failed to load provider data");
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  const handleSubscribe = async (planId) => {
    if (!providerId) {
      setError("Provider ID not found");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const selectedPlanData = plans.find((p) => p.id === planId);
      const amount = selectedPlanData.price * 100; // Convert to paise for Razorpay

      // Create order on backend
      const orderRes = await fetch(`${backendBase}/api/order/create-razorpay-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPlanData.price,
          description: `${selectedPlanData.name} Monthly Subscription`,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error("Failed to create payment order");
      }

      // Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Self Ordering Kiosk",
        description: `${selectedPlanData.name} Monthly Subscription`,
        order_id: orderData.order.id,
        // recurring: "1", // Enable recurring
        customer_notify: "1",
        email: providerData?.email,
        contact: providerData?.mobile,
        notes: {
          provider_id: providerId,
          plan_id: planId,
          plan_name: selectedPlanData.name,
        },
        handler: async function (response) {
          try {
            // Verify payment and subscribe provider
            const verifyRes = await fetch(`${backendBase}/api/providers/subscribe/${providerId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                plan: planId,
                amount: selectedPlanData.price,
                currency: "INR",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setMessage(`🎉 Successfully subscribed to ${selectedPlanData.name} plan!`);
              setSubscription(verifyData.provider.subscription);
              setTimeout(() => {
                router.refresh();
              }, 2000);
            } else {
              throw new Error(verifyData.message || "Payment verification failed");
            }
          } catch (err) {
            setError(err.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: providerData?.email,
          contact: providerData?.mobile,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to process subscription");
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!providerId) {
      setError("Provider ID not found");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const currentPlan = plans.find((p) => p.id === subscription?.plan);
      const amount = currentPlan.price * 100;

      // Create order
      const orderRes = await fetch(`${backendBase}/api/order/create-razorpay-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: currentPlan.price,
          description: `${currentPlan.name} Renewal`,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error("Failed to create payment order");
      }

      // Open Razorpay for renewal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Self Ordering Kiosk",
        description: `${currentPlan.name} Renewal`,
        order_id: orderData.order.id,
        email: providerData?.email,
        contact: providerData?.mobile,
        handler: async function (response) {
          try {
            // Renew subscription
            const renewRes = await fetch(
              `${backendBase}/api/providers/renew-subscription/${providerId}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const renewData = await renewRes.json();

            if (renewData.success) {
              setMessage("✅ Subscription renewed successfully!");
              setSubscription(renewData.provider.subscription);
              setTimeout(() => {
                router.refresh();
              }, 2000);
            } else {
              throw new Error(renewData.message || "Renewal failed");
            }
          } catch (err) {
            setError(err.message || "Renewal failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: providerData?.email,
          contact: providerData?.mobile,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to renew subscription");
      setLoading(false);
    }
  };

  if (loading && !providerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  const isTrial = subscription?.active && subscription?.status === "trial";
  const isSubscribed = subscription?.active && subscription?.status === "active";
  const showCurrentSubscription = isSubscribed || isTrial;
  const nextBillingDate = subscription?.nextBillingDate
    ? new Date(subscription.nextBillingDate).toLocaleDateString()
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Unlock powerful features with a monthly subscription to grow your business.
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700">
            {message}
          </div>
        )}

        {/* CURRENT SUBSCRIPTION */}
        {showCurrentSubscription && (
          <div className={`mb-8 bg-white rounded-2xl shadow-lg border-2 p-6 ${isTrial ? "border-blue-500" : "border-green-500"}`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Subscription</h2>
                <p className="text-gray-600 mb-4">
                  {isTrial ? (
                    <>You are on a <span className="font-bold text-blue-600">7-day free trial</span>.</>
                  ) : (
                    <>You are subscribed to the <span className="font-bold text-green-600">{subscription.plan}</span> plan.</>
                  )}
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Plan:</span> {isTrial ? "Trial" : subscription.plan}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span> {isTrial ? "Free" : `₹${subscription.amount}/month`}
                  </p>
                  {subscription.lastPaidDate && !isTrial && (
                    <p>
                      <span className="font-semibold">Last Paid:</span>{" "}
                      {new Date(subscription.lastPaidDate).toLocaleDateString()}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Next Billing:</span> {nextBillingDate || "Trial ends soon"}
                  </p>
                </div>
              </div>
              {!isTrial && (
                <button
                  onClick={handleRenew}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Renew Now
                </button>
              )}
            </div>
          </div>
        )}

        {/* PLANS GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            const isCurrent = subscription?.plan === plan.id && isSubscribed;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                  isCurrent
                    ? "ring-4 ring-green-500 bg-white scale-105"
                    : "bg-white hover:shadow-xl"
                }`}
              >
                {isCurrent && (
                  <div className="bg-green-500 text-white py-2 text-center font-semibold">
                    ✓ Current Plan
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-green-600 font-bold text-xl">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading || isCurrent}
                    className={`w-full py-3 rounded-xl font-semibold transition ${
                      isCurrent
                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                        : plan.id === "pro"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    {isCurrent ? "Current Plan" : `Subscribe to ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* INFO SECTION */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose a Plan</h3>
              <p className="text-gray-600">
                Select the subscription plan that best fits your business needs.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay with Razorpay</h3>
              <p className="text-gray-600">
                Secure payment processing with Razorpay. Automatic recurring billing every month.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enjoy Features</h3>
              <p className="text-gray-600">
                Access all features immediately and scale your business effortlessly.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Have questions about our plans? Contact our support team.
          </p>
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline font-semibold">
            support@example.com
          </a>
        </div>
      </div>
    </main>
  );
}
