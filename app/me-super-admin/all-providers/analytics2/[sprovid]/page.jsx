"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SettlementPage() {
    const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  const { sprovid } = useParams();

  // =========================
  // STATES
  // =========================

  // const [sprovid, setSprovid] = useState("SP001");

  const [date, setDate] = useState("");

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH HISTORY
  // =========================

  const fetchHistory = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/order/settlement/history/${sprovid}`
      );

      const data = await response.json();

      if (data.success) {
        setHistory(data.settlements);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    if (sprovid) {
      fetchHistory();
    }

  }, [sprovid]);

  // =========================
  // HANDLE SETTLEMENT
  // =========================

  const handleSettlement = async () => {

    if (!date) {
      alert("Please select date");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/order/settlement/${sprovid}/${date}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!data.success) {

        alert(data.message);

        return;
      }

      alert(data.message);

      // refresh history
      fetchHistory();

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
      }}
    >

      <h1>Settlement Dashboard</h1>

      {/* PROVIDER ID */}

      <div
        style={{
          marginBottom: "20px",
        }}
      >

        <label>Provider ID</label>

        <br />

        <input
          type="text"
          value={sprovid}
          onChange={(e) =>
            setSprovid(e.target.value)
          }
          style={{
            padding: "10px",
            width: "300px",
            marginTop: "5px",
          }}
        />
      </div>

      {/* DATE + BUTTON */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          style={{
            padding: "10px",
          }}
        />

        <button
          onClick={handleSettlement}
          disabled={loading}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >

          {loading
            ? "Processing..."
            : "Settle Day"}

        </button>

      </div>

      <hr />

      {/* HISTORY */}

      <h2>Settlement History</h2>

      {loading && history.length === 0 ? (

        <p>Loading...</p>

      ) : history.length === 0 ? (

        <p>No settlement history found</p>

      ) : (

        <div
          style={{
            overflowX: "auto",
          }}
        >

          <table
            border="1"
            cellPadding="12"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >

            <thead
              style={{
                background: "#f5f5f5",
              }}
            >
              <tr>
                <th>Date</th>
                <th>Total Orders</th>
                <th>Total Amount</th>
                <th>Settled At</th>
              </tr>
            </thead>

            <tbody>

              {history.map((item) => (

                <tr key={item._id}>

                  <td>{item.date}</td>

                  <td>{item.totalOrders}</td>

                  <td>
                    ₹ {item.totalAmount}
                  </td>

                  <td>
                    {new Date(
                      item.settledAt
                    ).toLocaleString()}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}