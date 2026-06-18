"use client";

import { useEffect, useState } from "react";

export default function ProviderProductsPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [providerId, setProviderId] = useState(null);

  // EDIT
  const [editModal, setEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageList, setImageList] = useState([]);
const [openImageModal, setOpenImageModal] = useState(false);

  // const [form, setForm] = useState({
  //   name: "",
  //   description: "",
  //   price: "",
  //   isAvailable: true,
  // });

  const [form, setForm] = useState({
  name: "",
  description: "",
  price: "",
  imagelink: "",
  isAvailable: true,
});
  const [image, setImage] = useState(null);

  // =========================
  // GET PROVIDER ID
  // =========================
  useEffect(() => {
    async function fetchCookies() {
      const res = await fetch("/api/cookies", {
        cache: "no-store",
      });

      const data = await res.json();

      setProviderId(data.id);
    }

    fetchCookies();
  }, []);

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    if (!providerId) return;

    fetchProducts();

  }, [providerId]);

  async function fetchProducts() {

    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/product/provider-products?spprovid=${providerId}`
      );

      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setMsg(data.message);
      }

      fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/image-add`)
  .then((res) => res.json())
  .then((data) => setImageList(data.simages || []))
  .catch(console.log);

    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // DELETE PRODUCT
  // =========================
  async function handleDelete(id) {

    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/product/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {

        setProducts((prev) =>
          prev.filter((p) => p._id !== id)
        );

      } else {
        alert(data.message);
      }

    } catch (err) {
      alert(err.message);
    }
  }

  // =========================
  // OPEN EDIT MODAL
  // =========================
  function openEdit(product) {

    setSelectedProduct(product);

    // setForm({
    //   name: product.name,
    //   description: product.description,
    //   price: product.price,
    //   isAvailable: product.isAvailable,
    // });
    setForm({
  name: product.name,
  description: product.description,
  price: product.price,
  imagelink: product.imagelink || "",
  isAvailable: product.isAvailable,
});

    setEditModal(true);
  }

  // =========================
  // INPUT CHANGE
  // =========================
  function handleChange(e) {

    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  // =========================
  // IMAGE CHANGE
  // =========================
  function handleImage(e) {
    setImage(e.target.files[0]);
  }

  // =========================
  // UPDATE PRODUCT
  // =========================
  async function handleUpdate(e) {

    e.preventDefault();

    try {

      // const formData = new FormData();

      // formData.append("name", form.name);
      // formData.append("description", form.description);
      // formData.append("price", form.price);
      // formData.append("isAvailable", form.isAvailable);
      // formData.append("imagelink", form.imagelink);

      // if (image) {
      //   // formData.append("image", image);
      //   formData.append("image", "");
      // }

      // const obj = Object.fromEntries(formData.entries());

       const payload = {
            name: form.name,
            description: form.description,
            price: form.price,
            imagelink: form.imagelink,
            isAvailable: form.isAvailable,
            // spcategoryid: form.spcategoryid,
            // sptypeid: form.sptypeid,
            // sprovid: form.sprovid,
            // spcategoryname: selectedCategory?.name || "",
            // sptypename: selectedType?.name || "",
          };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/product/${selectedProduct._id}`,
        {
          method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          // body: formData,
          // body: JSON.stringify(obj),
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.success) {

        setProducts((prev) =>
          prev.map((p) =>
            p._id === data.product._id
              ? data.product
              : p
          )
        );

        setEditModal(false);

      } else {
        alert(data.message);
      }

    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 text-center">
          My Products
        </h1>

        {loading ? (
          <p className="text-center">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center">
            No products found
          </p>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {products.map((p) => (

              <div
                key={p._id}
                className="bg-white shadow rounded-lg p-4"
              >

                {/* IMAGE */}
                <img
                  src={
                    p.image
                      ? `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}${p.image}`
                      : p.imagelink
                  }
                  alt={p.name}
                  className="w-full h-40 object-cover rounded"
                />

                {/* INFO */}
                <h2 className="text-lg font-semibold mt-2">
                  {p.name}
                </h2>

                <p className="text-sm text-gray-600">
                  {p.description}
                </p>

                <p className="font-bold mt-1">
                  ₹{p.price}
                </p>

                {/* STATUS */}
                <p
                  className={`mt-2 text-sm font-medium ${
                    p.isAvailable
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {p.isAvailable
                    ? "Available"
                    : "Not Available"}
                </p>

                {/* BUTTONS */}
                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => openEdit(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* ========================= */}
      {/* EDIT MODAL */}
      {/* ========================= */}
      {editModal && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg">

            <div className="flex justify-between mb-4">

              <h2 className="text-xl font-bold">
                Edit Product
              </h2>

              <button
                onClick={() => setEditModal(false)}
                className="text-red-600"
              >
                ✖
              </button>

            </div>

            <form
              onSubmit={handleUpdate}
              className="grid gap-3"
            >

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="border p-2 rounded"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-2 rounded"
              />

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="border p-2 rounded"
              />

              {/* IMAGE */}
              <input
                type="file"
                onChange={handleImage}
                className="border p-2 rounded"
              />

              {/* STATUS */}
              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                />

                Available

              </label>
               <input
                type="text"
                name="imagelink"
                value={form.imagelink}
                onChange={handleChange}
                placeholder="Image Link"
                className="border p-2 rounded"
              />
              {form.imagelink && (
                  <img
                    src={form.imagelink}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                )}
                <div>
                  <p className="font-semibold mb-2">
                    Product Image
                  </p>

                  <button
                    type="button"
                    onClick={() => setOpenImageModal(true)}
                    className="bg-gray-800 text-white px-4 py-2 rounded"
                  >
                    Choose Image
                  </button>
                </div>

              <button
                type="submit"
                className="bg-green-600 text-white py-2 rounded"
              >
                Update Product
              </button>

            </form>

          </div>

        </div>
      )}

      {/* IMAGE MODAL */}
{openImageModal && (

  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

    <div className="bg-white w-[90%] max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-bold">
          Select Image
        </h2>

        <button
          onClick={() => setOpenImageModal(false)}
          className="text-red-600 font-bold"
        >
          Close ✖
        </button>

      </div>

      {/* IMAGE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        {imageList.map((img) => (

          <div
            key={img._id}
            onClick={() => {

              setForm((p) => ({
                ...p,
                imagelink: img.imagelink,
              }));

              setOpenImageModal(false);
            }}
            className={`cursor-pointer border rounded overflow-hidden hover:shadow-lg ${
              form.imagelink === img.imagelink
                ? "border-blue-600"
                : "border-gray-300"
            }`}
          >

            <img
              src={img.imagelink}
              alt="img"
              className="w-full h-28 object-cover"
            />

            <div className="text-center text-xs p-1">
              {img.imageCategory || "No Category"}
            </div>

          </div>
        ))}

      </div>

    </div>

  </div>
)}

    </div>
  );
}

// ====================full working without edit ==========================
// "use client";

// import { useEffect, useState } from "react";

// export default function ProviderProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState(null);
//   const [providerId, setProviderId] = useState(null);

//   // GET PROVIDER ID FROM COOKIE
//   useEffect(() => {
//     async function fetchCookies() {
//       const res = await fetch("/api/cookies", { cache: "no-store" });
//       const data = await res.json();
//       setProviderId(data.id);
//       console.log(data.id)
//     }
//     fetchCookies();
//   }, []);

//   // FETCH PRODUCTS
//   useEffect(() => {
//     if (!providerId) return;

//     async function fetchProducts() {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/product/provider-products?spprovid=${providerId}`
//         );

//         const data = await res.json();

//         if (data.success) {
//           setProducts(data.products || []);
//         } else {
//           setMsg(data.message);
//         }
//       } catch (err) {
//         setMsg(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, [providerId]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">

//         <h1 className="text-2xl font-bold mb-6 text-center">
//           My Products
//         </h1>

//         {msg && (
//           <p className="bg-red-200 p-2 text-center rounded mb-4">
//             {msg}
//           </p>
//         )}

//         {loading ? (
//           <p className="text-center">Loading products...</p>
//         ) : products.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No products found
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//             {products.map((p) => (
//               <div
//                 // key={p._id}
//                 key={p.name}
//                 className="bg-white shadow rounded-lg p-4"
//               >

//                 {/* IMAGE */}
//                 <img
//                   src={
//                     p.image
//                       ? `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}${p.image}`
//                       : p.imagelink
//                   }
//                   alt={p.name}
//                   className="w-full h-40 object-cover rounded"
//                 />

//                 {/* INFO */}
//                 <h2 className="text-lg font-semibold mt-2">
//                   {p.name}
//                 </h2>

//                 <p className="text-sm text-gray-600">
//                   {p.description}
//                 </p>

//                 <p className="font-bold mt-1">
//                   ₹{p.price}
//                 </p>

//                 {/* CATEGORY + TYPE */}
//                 <div className="text-xs text-gray-500 mt-2">
//                   <p>Category: {p.spcategoryname}</p>
//                   <p>Type: {p.sptypename}</p>
//                 </div>

//                 {/* STATUS */}
//                 <p
//                   className={`mt-2 text-sm font-medium ${
//                     p.isAvailable
//                       ? "text-green-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {p.isAvailable
//                     ? "Available"
//                     : "Not Available"}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }













// // ==============================extra =====================================

// // "use client";

// // import { useEffect, useState } from "react";

// // export default function ProviderProductsPage() {
// //     const [products, setProducts] = useState([]);
// //     const [provider, setProvider] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [msg, setMsg] = useState("");

// //     useEffect(() => {
// //         async function init() {
// //             try {
// //                 setLoading(true);

// //                 // 1. Get providerId from cookie
// //                 const cookieRes = await fetch("/api/cookies", { cache: "no-store" });
// //                 const cookieData = await cookieRes.json();

// //                 if (!cookieData?.id) {
// //                     setMsg("Provider not found");
// //                     return;
// //                 }

// //                 const providerId = cookieData.id;

// //                 // 2. Fetch provider profile
// //                 const providerRes = await fetch(
// //                     `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/provider/${providerId}`
// //                 );
// //                 const providerData = await providerRes.json();

// //                 if (providerData.success) {
// //                     setProvider(providerData.provider);
// //                 }

// //                 // 3. Fetch products
// //                 const productRes = await fetch(
// //                     `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/product/provider-products?spprovid=${providerId}`
// //                 );
// //                 const productData = await productRes.json();

// //                 if (productData.success) {
// //                     setProducts(productData.products || []);
// //                 } else {
// //                     setMsg(productData.message);
// //                 }
// //             } catch (err) {
// //                 setMsg(err.message);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         }

// //         init();
// //     }, []);

// //     return (
// //         <div className="min-h-screen bg-gray-100 p-6">
// //             <div className="max-w-6xl mx-auto">

// //                 <h1 className="text-2xl font-bold text-center mb-4">
// //                     My Products Dashboard
// //                 </h1>

// //                 {/* PROVIDER INFO */}
// //                 {provider && (
// //                     <div className="bg-white p-4 rounded shadow mb-6">
// //                         <h2 className="text-lg font-semibold">
// //                             {provider.name}
// //                         </h2>

// //                         <p className="text-sm text-gray-600">
// //                             Email: {provider.email}
// //                         </p>

// //                         <p className="text-sm text-gray-600">
// //                             Mobile: {provider.mobile}
// //                         </p>

// //                         {/* GST INFO */}
// //                         <p className="text-sm mt-2">
// //                             GST:{" "}
// //                             {provider.additionalDetails?.gst?.accept
// //                                 ? `${provider.additionalDetails.gst.percent}%`
// //                                 : "Not Applied"}
// //                         </p>

// //                         {/* PRODUCT TYPES */}
// //                         <div className="mt-2 text-xs text-gray-600">
// //                             Types:{" "}
// //                             {provider.additionalDetails?.productType?.join(", ")}
// //                         </div>

// //                         {/* CATEGORY */}
// //                         <div className="text-xs text-gray-600">
// //                             Categories:{" "}
// //                             {provider.additionalDetails?.productCategory?.join(", ")}
// //                         </div>
// //                     </div>
// //                 )}

// //                 {/* ERROR */}
// //                 {msg && (
// //                     <p className="bg-red-200 p-2 text-center rounded mb-4">
// //                         {msg}
// //                     </p>
// //                 )}

// //                 {/* LOADING */}
// //                 {loading ? (
// //                     <p className="text-center">Loading...</p>
// //                 ) : products.length === 0 ? (
// //                     <p className="text-center text-gray-500">
// //                         No products found
// //                     </p>
// //                 ) : (
// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                         {products.map((p) => (
// //                             <div key={p._id} className="bg-white shadow rounded-lg p-4">

// //                                 <img
// //                                     src={
// //                                         p.image
// //                                             ? `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}${p.image}`
// //                                             : p.imagelink
// //                                     }
// //                                     className="w-full h-40 object-cover rounded"
// //                                 />

// //                                 <h2 className="text-lg font-semibold mt-2">
// //                                     {p.name}
// //                                 </h2>

// //                                 <p className="text-sm text-gray-600">
// //                                     {p.description}
// //                                 </p>

// //                                 <p className="font-bold mt-1">₹{p.price}</p>

// //                                 <div className="text-xs text-gray-500 mt-2">
// //                                     <p>Category: {p.spcategoryname}</p>
// //                                     <p>Type: {p.sptypename}</p>
// //                                 </div>

// //                                 <p
// //                                     className={`mt-2 text-sm font-medium ${p.isAvailable ? "text-green-600" : "text-red-600"
// //                                         }`}
// //                                 >
// //                                     {p.isAvailable ? "Available" : "Not Available"}
// //                                 </p>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // }

