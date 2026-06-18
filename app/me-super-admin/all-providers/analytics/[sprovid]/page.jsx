"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProviderAnalyticsPage() {

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  const { sprovid } = useParams();

  // =====================================================
  // STATES
  // =====================================================

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [loading, setLoading] =
    useState(true);

  const [analytics, setAnalytics] =
    useState(null);

  // =====================================================
  // FETCH ANALYTICS
  // =====================================================

  useEffect(() => {

    if (!sprovid || !selectedDate) return;

    async function fetchAnalytics() {

      try {

        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/api/order/day-report/${sprovid}/${selectedDate}`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (data.success) {

          setAnalytics(
            data.result?.[0] || null
          );
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    }

    fetchAnalytics();

  }, [sprovid, selectedDate]);

  // =====================================================
  // HELPERS
  // =====================================================

  const summary =
    analytics?.summary?.[0] || {};

  const getSettlementData = (status) => {

    return analytics?.settlementReport?.find(
      (item) => item._id === status
    );
  };

  const getPaymentData = (method) => {

    return analytics?.paymentReport?.find(
      (item) => item._id === method
    );
  };


    const getpaymentStatusData = (status) => {

    return analytics?.paymentStuatusReport?.find(
      (item) => item._id === status
    );
  };

  const pendingSettlement =
    getSettlementData("pending");

  const completedSettlement =
    getSettlementData("completed");

  const onlinePayments =
    getPaymentData("online");

  const counterPayments =
    getPaymentData("pay_at_counter");


      const PaymentsPaidStaus =
    getpaymentStatusData("Paid");
        const PaymentsUnPaidStaus =
    getpaymentStatusData("UnPaid");

  // =====================================================
  // CARD
  // =====================================================

  const Card = ({
    title,
    value,
    color = "text-black",
    subtitle,
  }) => (

    <div className="bg-white rounded-2xl shadow border p-5">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2
        className={`text-3xl font-bold mt-2 ${color}`}
      >
        {value}
      </h2>

      {subtitle && (

        <p className="text-xs text-gray-400 mt-2">
          {subtitle}
        </p>
      )}

    </div>
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading Analytics...

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              Analytics Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Daily analytics overview
            </p>

          </div>

          {/* DATE PICKER */}

          <div className="bg-white p-3 rounded-xl shadow border">

            <label className="text-sm text-gray-500 block mb-1">
              Select Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              className="border rounded-lg px-3 py-2 outline-none"
            />

          </div>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <Card
            title="Total Orders"
            value={summary.totalOrders || 0}
            color="text-blue-600"
          />

          <Card
            title="Total Revenue"
            value={`₹${summary.totalAmount || 0}`}
            color="text-green-600"
          />

          <Card
            title="Pending Settlement"
            value={`₹${pendingSettlement?.totalAmount || 0}`}
            subtitle={`${pendingSettlement?.totalOrders || 0} orders`}
            color="text-orange-500"
          />

          <Card
            title="Completed Settlement"
            value={`₹${completedSettlement?.totalAmount || 0}`}
            subtitle={`${completedSettlement?.totalOrders || 0} orders`}
            color="text-purple-600"
          />

        </div>

        {/* PAYMENT BREAKDOWN */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

          <Card
            title="Online Payments"
            value={`₹${onlinePayments?.totalAmount || 0}`}
            subtitle={`${onlinePayments?.totalOrders || 0} orders`}
            color="text-cyan-600"
          />

          <Card
            title="Pay At Counter"
            value={`₹${counterPayments?.totalAmount || 0}`}
            subtitle={`${counterPayments?.totalOrders || 0} orders`}
            color="text-pink-600"
          />

        </div>

        {/* paid unPaid  */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

          <Card
            title="Paid Orders"
            value={`₹${PaymentsPaidStaus?.totalAmount || 0}`}
            subtitle={`${PaymentsPaidStaus?.totalOrders || 0} orders`}
            color="text-cyan-600"
          />

          <Card
            title="Unapid Orders"
            value={`₹${PaymentsUnPaidStaus?.totalAmount || 0}`}
            subtitle={`${PaymentsUnPaidStaus?.totalOrders || 0} orders`}
            color="text-pink-600"
          />

        </div>

      </div>

    </div>
  );
}
// ==================================================
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function ProviderAnalyticsPage() {

//   const BASE_URL =
//     process.env.NEXT_PUBLIC_BACKEN_BASE_URL;
//       const { sprovid } = useParams();

//   const [cookies, setCookies] = useState({
//     id: sprovid,
//   });

//   const [orders, setOrders] = useState([]);

//   const [loading, setLoading] = useState(true);

//   // =====================================================
//   // GET PROVIDER ID
//   // =====================================================

//   useEffect(() => {

//     async function fetchCookies() {

//       const res = await fetch(
//         "/api/cookies",
//         {
//           cache: "no-store",
//         }
//       );

//       const data = await res.json();

//       setCookies(data);

//        setCookies({ id: sprovid })
//     }

//     fetchCookies();

//   }, []);

//   // =====================================================
//   // FETCH ORDERS
//   // =====================================================

//   useEffect(() => {

//     if (!cookies.id) return;

//     async function fetchOrders() {

//       try {

//         setLoading(true);

//         const res = await fetch(
//           `${BASE_URL}/api/order/provider-orders/${cookies.id}?page=1&limit=1000`
//         );

//         const data = await res.json();

//         if (data.success) {
//           setOrders(data.orders || []);
//         }

//       } catch (err) {

//         console.log(err);

//       } finally {

//         setLoading(false);
//       }
//     }

//     fetchOrders();

//   }, [cookies.id]);

//   // =====================================================
//   // DATE HELPERS
//   // =====================================================

//   const today =
//     new Date().toDateString();

//   const currentMonth =
//     new Date().getMonth();

//   const currentYear =
//     new Date().getFullYear();

//   const isToday = (date) =>
//     new Date(date).toDateString() ===
//     today;

//   const isThisMonth = (date) => {

//     const d = new Date(date);

//     return (
//       d.getMonth() === currentMonth &&
//       d.getFullYear() === currentYear
//     );
//   };

//   // =====================================================
//   // PAYMENT DATA
//   // =====================================================

//   const paidOrders = orders.filter(
//     (o) => o.paymentStatus === "Paid"
//   );

//   const unpaidOrders = orders.filter(
//     (o) => o.paymentStatus !== "Paid"
//   );

//   // =====================================================
//   // SETTLEMENT DATA
//   // =====================================================

//   const pendingSettlementOrders =
//     orders.filter(
//       (o) =>
//         o.settleStatus === "pending"
//     );

//   const completedSettlementOrders =
//     orders.filter(
//       (o) =>
//         o.settleStatus === "completed"
//     );

//   const pendingSettlementAmount =
//     pendingSettlementOrders.reduce(
//       (sum, order) =>
//         sum + (order.totalAmount || 0),
//       0
//     );

//   const completedSettlementAmount =
//     completedSettlementOrders.reduce(
//       (sum, order) =>
//         sum + (order.totalAmount || 0),
//       0
//     );

//   // =====================================================
//   // EARNINGS
//   // =====================================================

//   const totalEarnings =
//     paidOrders.reduce(
//       (sum, o) =>
//         sum + (o.totalAmount || 0),
//       0
//     );

//   const todayEarnings =
//     paidOrders
//       .filter((o) =>
//         isToday(o.createdAt)
//       )
//       .reduce(
//         (sum, o) =>
//           sum + (o.totalAmount || 0),
//         0
//       );

//   const monthEarnings =
//     paidOrders
//       .filter((o) =>
//         isThisMonth(o.createdAt)
//       )
//       .reduce(
//         (sum, o) =>
//           sum + (o.totalAmount || 0),
//         0
//       );

//   // =====================================================
//   // ORDERS
//   // =====================================================

//   const todayOrders =
//     orders.filter((o) =>
//       isToday(o.createdAt)
//     ).length;

//   const monthOrders =
//     orders.filter((o) =>
//       isThisMonth(o.createdAt)
//     ).length;

//   // =====================================================
//   // UNPAID AMOUNT
//   // =====================================================

//   const unpaidAmount =
//     unpaidOrders.reduce(
//       (sum, o) =>
//         sum + (o.totalAmount || 0),
//       0
//     );

//   // =====================================================
//   // CARD COMPONENT
//   // =====================================================

//   const Card = ({
//     title,
//     value,
//     color,
//   }) => (

//     <div className="bg-white shadow rounded-2xl p-5">

//       <p className="text-gray-500 text-sm">
//         {title}
//       </p>

//       <h2
//         className={`text-2xl font-bold mt-2 ${color}`}
//       >
//         ₹
//         {value}
//       </h2>

//     </div>
//   );

//   // =====================================================
//   // UI
//   // =====================================================

//   return (

//     <div className="min-h-screen bg-gray-100 p-6">

//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}

//         <div className="mb-6">

//           <h1 className="text-3xl font-bold">
//             Earnings Dashboard
//           </h1>

//           <p className="text-gray-500">
//             Track your business analytics
//           </p>

//         </div>

//         {loading ? (

//           <div className="text-center py-20">
//             Loading analytics...
//           </div>

//         ) : (

//           <>

//             {/* ================================= */}
//             {/* FIRST GRID */}
//             {/* ================================= */}

//             <div className="grid md:grid-cols-4 gap-4">

//               <Card
//                 title="Today Earnings"
//                 value={todayEarnings}
//                 color="text-green-600"
//               />

//               <Card
//                 title="This Month Earnings"
//                 value={monthEarnings}
//                 color="text-blue-600"
//               />

//               <Card
//                 title="Total Earnings"
//                 value={totalEarnings}
//                 color="text-purple-600"
//               />

//               <Card
//                 title="Unpaid Amount"
//                 value={unpaidAmount}
//                 color="text-red-500"
//               />

//             </div>

//             {/* ================================= */}
//             {/* SECOND GRID */}
//             {/* ================================= */}

//             <div className="grid md:grid-cols-4 gap-4 mt-6">

//               <Card
//                 title="Pending Settlement"
//                 value={
//                   pendingSettlementAmount
//                 }
//                 color="text-orange-500"
//               />

//               <Card
//                 title="Completed Settlement"
//                 value={
//                   completedSettlementAmount
//                 }
//                 color="text-green-700"
//               />

//               <Card
//                 title="Pending Settelement Orders Count"
//                 value={
//                   pendingSettlementOrders.length
//                 }
//                 color="text-yellow-600"
//               />

//               <Card
//                 title="Settled Orders Count"
//                 value={
//                   completedSettlementOrders.length
//                 }
//                 color="text-indigo-600"
//               />

//             </div>

//             {/* ================================= */}
//             {/* INFO SECTION */}
//             {/* ================================= */}

//             <div className="grid md:grid-cols-2 gap-4 mt-6">

//               {/* ORDER SUMMARY */}

//               <div className="bg-white p-5 rounded-2xl shadow">

//                 <h3 className="font-bold mb-3 text-lg">
//                   Orders Summary
//                 </h3>

//                 <div className="space-y-2">

//                   <p>
//                     Today Orders:
//                     <span className="font-semibold ml-2">
//                       {todayOrders}
//                     </span>
//                   </p>

//                   <p>
//                     This Month Orders:
//                     <span className="font-semibold ml-2">
//                       {monthOrders}
//                     </span>
//                   </p>

//                   <p>
//                     Total Orders:
//                     <span className="font-semibold ml-2">
//                       {orders.length}
//                     </span>
//                   </p>

//                 </div>

//               </div>

//               {/* PAYMENT SUMMARY */}

//               <div className="bg-white p-5 rounded-2xl shadow">

//                 <h3 className="font-bold mb-3 text-lg">
//                   Payment & Settlement
//                 </h3>

//                 <div className="space-y-2">

//                   <p>
//                     Paid Orders:
//                     <span className="font-semibold ml-2 text-green-600">
//                       {paidOrders.length}
//                     </span>
//                   </p>

//                   <p>
//                     Unpaid Orders:
//                     <span className="font-semibold ml-2 text-red-500">
//                       {unpaidOrders.length}
//                     </span>
//                   </p>

//                   <p>
//                     Pending Settlement Orders:
//                     <span className="font-semibold ml-2 text-orange-500">
//                       {
//                         pendingSettlementOrders.length
//                       }
//                     </span>
//                   </p>

//                   <p>
//                     Completed Settlement Orders:
//                     <span className="font-semibold ml-2 text-blue-600">
//                       {
//                         completedSettlementOrders.length
//                       }
//                     </span>
//                   </p>

//                 </div>

//               </div>

//             </div>

//           </>
//         )}

//       </div>

//     </div>
//   );
// }




// ====================================================================
// "use client";

// import { useEffect, useState } from "react";

// export default function ProviderAnalyticsPage() {
//   const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

//   const [cookies, setCookies] = useState({ id: null });
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // =====================================================
//   // GET PROVIDER ID
//   // =====================================================
//   useEffect(() => {
//     async function fetchCookies() {
//       const res = await fetch("/api/cookies", { cache: "no-store" });
//       const data = await res.json();
//       setCookies(data);
//     }

//     fetchCookies();
//   }, []);

//   // =====================================================
//   // FETCH ALL ORDERS (no pagination for analytics)
//   // =====================================================
//   useEffect(() => {
//     if (!cookies.id) return;

//     async function fetchOrders() {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `${BASE_URL}/api/order/provider-orders/${cookies.id}?page=1&limit=1000`
//         );

//         const data = await res.json();

//         if (data.success) {
//           setOrders(data.orders || []);
//         }
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   }, [cookies.id]);

//   // =====================================================
//   // DATE HELPERS
//   // =====================================================
//   const today = new Date().toDateString();
//   const currentMonth = new Date().getMonth();
//   const currentYear = new Date().getFullYear();

//   const isToday = (date) => new Date(date).toDateString() === today;

//   const isThisMonth = (date) => {
//     const d = new Date(date);
//     return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
//   };

//   // =====================================================
//   // CALCULATIONS
//   // =====================================================
//   const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");

//   const totalEarnings = paidOrders.reduce(
//     (sum, o) => sum + (o.totalAmount || 0),
//     0
//   );

//   const todayEarnings = paidOrders
//     .filter((o) => isToday(o.createdAt))
//     .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

//   const monthEarnings = paidOrders
//     .filter((o) => isThisMonth(o.createdAt))
//     .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

//   const todayOrders = orders.filter((o) => isToday(o.createdAt)).length;

//   const monthOrders = orders.filter((o) =>
//     isThisMonth(o.createdAt)
//   ).length;

//   const unpaidAmount = orders
//     .filter((o) => o.paymentStatus !== "Paid")
//     .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

//   // =====================================================
//   // UI CARD
//   // =====================================================
//   const Card = ({ title, value, color }) => (
//     <div className="bg-white shadow rounded-2xl p-5">
//       <p className="text-gray-500 text-sm">{title}</p>
//       <h2 className={`text-2xl font-bold mt-2 ${color}`}>
//         ₹{value}
//       </h2>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold">
//             Earnings Dashboard
//           </h1>
//           <p className="text-gray-500">
//             Track your business performance
//           </p>
//         </div>

//         {loading ? (
//           <div className="text-center py-20">
//             Loading analytics...
//           </div>
//         ) : (
//           <>
//             {/* STATS GRID */}
//             <div className="grid md:grid-cols-4 gap-4">

//               <Card
//                 title="Today Earnings"
//                 value={todayEarnings}
//                 color="text-green-600"
//               />

//               <Card
//                 title="This Month"
//                 value={monthEarnings}
//                 color="text-blue-600"
//               />

//               <Card
//                 title="Total Earnings"
//                 value={totalEarnings}
//                 color="text-purple-600"
//               />

//               <Card
//                 title="Unpaid Amount"
//                 value={unpaidAmount}
//                 color="text-red-500"
//               />
//             </div>

//             {/* SECOND ROW */}
//             <div className="grid md:grid-cols-2 gap-4 mt-6">

//               <div className="bg-white p-5 rounded-2xl shadow">
//                 <h3 className="font-bold mb-3">
//                   Orders Summary
//                 </h3>

//                 <p>Today Orders: {todayOrders}</p>
//                 <p>This Month Orders: {monthOrders}</p>
//                 <p>Total Orders: {orders.length}</p>
//               </div>

//               <div className="bg-white p-5 rounded-2xl shadow">
//                 <h3 className="font-bold mb-3">
//                   Payment Breakdown
//                 </h3>

//                 <p>Paid Orders: {paidOrders.length}</p>
//                 <p>
//                   Unpaid Orders:{" "}
//                   {orders.length - paidOrders.length}
//                 </p>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }