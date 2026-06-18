

"use client";

import { useState, useEffect } from "react";

export default function ProviderPage() {

    const [user, setUser] = useState("");
    const [sprovid, setSprovid] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // users list
    const [providerUsers, setProviderUsers] = useState([]);

    const [cookies, setCookies] = useState({
        id: null,
    });

    // =====================================================
    // GET COOKIE USER ID
    // =====================================================

    useEffect(() => {

        async function fetchCookies() {

            const res = await fetch("/api/cookies", {
                cache: "no-store",
            });

            const data = await res.json();

            setCookies(data);

            setSprovid(data.id || "");
        }

        fetchCookies();

    }, []);

    // =====================================================
    // GET USERS BY PROVIDER ID
    // =====================================================

    const fetchProviderUsers = async (providerId) => {

        if (!providerId) return;

        try {

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/user/provider-users/${providerId}`
            );

            const data = await res.json();

            if (data.success) {
                setProviderUsers(data.users);
            }

        } catch (error) {
            console.log(error);
        }
    };

    // =====================================================
    // UPDATE PROVIDER ID
    // =====================================================

    const updateProvider = async (e) => {

        e.preventDefault();

        if (!user) {
            setMessage("User not found");
            return;
        }

        if (!sprovid) {
            setMessage("Provider ID is required");
            return;
        }

        try {

            setLoading(true);
            setMessage("");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/user/update-provider-id`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        suid: user,
                        sprovid,
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {

                setMessage("Provider ID updated successfully");

                // fetch users after update
                fetchProviderUsers(sprovid);

            } else {
                setMessage(data.message || "Something went wrong");
            }

        } catch (error) {

            console.error(error);
            setMessage("Server error");

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // AUTO LOAD USERS WHEN PROVIDER ID EXISTS
    // =====================================================

    useEffect(() => {

        if (sprovid) {
            fetchProviderUsers(sprovid);
        }

    }, [sprovid]);

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f5",
                padding: "40px",
            }}
        >

            {/* FORM */}

            <div
                style={{
                    width: "400px",
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    margin: "0 auto",
                }}
            >

                <h2
                    style={{
                        marginBottom: "20px",
                        textAlign: "center",
                    }}
                >
                    Add Users
                </h2>

                <form onSubmit={updateProvider}>

                    <div style={{ marginBottom: "15px" }}>
                        <label>User ID</label>

                        <input
                            type="text"
                            value={user || ""}
                            onChange={(e) =>
                                setUser(e.target.value)
                            }
                            placeholder="Enter User ID"
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Provider ID</label>

                        <input
                            type="text"
                            value={sprovid}
                            onChange={(e) =>
                                setSprovid(e.target.value)
                            }
                            placeholder="Enter Provider ID"
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#000",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Provider ID"}
                    </button>

                </form>

                {message && (
                    <p
                        style={{
                            marginTop: "15px",
                            textAlign: "center",
                            color: "green",
                        }}
                    >
                        {message}
                    </p>
                )}

            </div>

            {/* USERS LIST */}

            <div
                style={{
                    maxWidth: "900px",
                    margin: "40px auto",
                }}
            >

                <h2
                    style={{
                        marginBottom: "20px",
                        fontSize: "24px",
                        fontWeight: "bold",
                    }}
                >
                    Users with You
                </h2>

                {
                    providerUsers.length === 0 ? (

                        <p>No users found</p>

                    ) : (

                        <div
                            style={{
                                display: "grid",
                                gap: "20px",
                            }}
                        >

                            {providerUsers.map((item, index) => (

                                <div
                                    key={index}
                                    style={{
                                        background: "#fff",
                                        padding: "20px",
                                        borderRadius: "10px",
                                        boxShadow:
                                            "0 0 10px rgba(0,0,0,0.05)",
                                    }}
                                >

                                    <p>
                                        <strong>Name:</strong>{" "}
                                        {item.name}
                                    </p>

                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {item.email}
                                    </p>

                                    <p>
                                        <strong>Mobile:</strong>{" "}
                                        {item.mobile}
                                    </p>

                                    <p>
                                        <strong>User ID:</strong>{" "}
                                        {item.suid}
                                    </p>

                                    <p>
                                        <strong>Provider ID:</strong>{" "}
                                        {item.sprovid}
                                    </p>

                                </div>

                            ))}

                        </div>

                    )
                }

            </div>

        </div>
    );
}



// ==============================================================

// "use client";

// import { useState, useEffect } from "react";

// export default function ProviderPage() {
//     const [user, setUser] = useState("");
//     const [sprovid, setSprovid] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");


//      const [cookies, setCookies] = useState({
//     id: null,
//   });

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
//       setSprovid(data.id || ""); // preload provider id if exists
//     }

//     fetchCookies();

//   }, []);

//     // Update provider id
//     const updateProvider = async (e) => {
//         e.preventDefault();

//         if (!user) {
//             setMessage("User not found");
//             return;
//         }

//         if (!sprovid) {
//             setMessage("Provider ID is required");
//             return;
//         }

//         try {
//             setLoading(true);
//             setMessage("");

//             const res = await fetch(
//                 "http://localhost:8000/api/user/update-provider-id",
//                 {
//                     method: "PUT",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                         suid: user,
//                         sprovid,
//                     }),
//                 }
//             );

//             const data = await res.json();

//             if (data.success) {
//                 setMessage("Provider ID updated successfully");

//                 // update local storage user
//                 const updatedUser = data.user;

//                 localStorage.setItem(
//                     "user",
//                     JSON.stringify(updatedUser)
//                 );

//                 setUser(updatedUser);
//             } else {
//                 setMessage(data.message || "Something went wrong");
//             }
//         } catch (error) {
//             console.error(error);
//             setMessage("Server error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 background: "#f5f5f5",
//             }}
//         >
//             <div
//                 style={{
//                     width: "400px",
//                     background: "#fff",
//                     padding: "30px",
//                     borderRadius: "10px",
//                     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//                 }}
//             >
//                 <h2
//                     style={{
//                         marginBottom: "20px",
//                         textAlign: "center",
//                     }}
//                 >
//                     Update Provider ID
//                 </h2>

//                 <form onSubmit={updateProvider}>
//                     <div style={{ marginBottom: "15px" }}>
//                         <label>User ID</label>

//                         <input
//                             type="text"
//                             value={user|| ""}
//                             onChange={(e) =>
//                                 setUser(e.target.value)
//                             }
//                             placeholder="Enter User ID"
//                             style={{
//                                 width: "100%",
//                                 padding: "10px",
//                                 marginTop: "5px",
//                             }}
//                         />
//                     </div>

//                     <div style={{ marginBottom: "15px" }}>
//                         <label>Provider ID</label>

//                         <input
//                             type="text"
//                             value={sprovid}
//                             onChange={(e) =>
//                                 setSprovid(e.target.value)
//                             }
//                             placeholder="Enter Provider ID"
//                             style={{
//                                 width: "100%",
//                                 padding: "10px",
//                                 marginTop: "5px",
//                             }}
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         style={{
//                             width: "100%",
//                             padding: "12px",
//                             background: "#000",
//                             color: "#fff",
//                             border: "none",
//                             cursor: "pointer",
//                         }}
//                     >
//                         {loading ? "Updating..." : "Update Provider ID"}
//                     </button>
//                 </form>

//                 {message && (
//                     <p
//                         style={{
//                             marginTop: "15px",
//                             textAlign: "center",
//                             color: "green",
//                         }}
//                     >
//                         {message}
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// }