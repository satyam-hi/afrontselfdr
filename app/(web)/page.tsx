import Link from "next/link";
import Footer from "@/app/component/web/footer";

export default function HomePage() {
  const features = [
    {
      icon: "📅",
      title: "Smart Appointment Booking",
      desc: "Patients can schedule appointments directly from their mobile devices or clinic kiosks.",
    },
    {
      icon: "📱",
      title: "QR Code Check-In",
      desc: "Scan QR code upon arrival at the clinic to instantly check-in and view queue status.",
    },
    {
      icon: "💳",
      title: "Secure Medical Payments",
      desc: "Accept UPI, credit/debit cards, insurance processing, and cash payments seamlessly.",
    },
    {
      icon: "🩺",
      title: "OPD & Teleconsultation",
      desc: "Comprehensive support for physical in-clinic visits and virtual video consultations.",
    },
    {
      icon: "📊",
      title: "Patient Analytics Dashboard",
      desc: "Track daily appointments, clinic revenue, and patient demographics easily.",
    },
    {
      icon: "🏥",
      title: "Multi-Clinic Support",
      desc: "Doctors and medical centers can register and manage multiple branches seamlessly.",
    },
  ];

  const pricing = [
    {
      name: "Free Trial",
      price: "free",
    },
    {
      name: "Clinic Pro Plan",
      price: "₹ 244/month",
    },
  ];

  return (
    <main className="bg-[#050505] text-white overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center px-6">

        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-blue-500/10 to-emerald-500/20 blur-3xl" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* LEFT */}
          <div className="animate-fadeIn">

            <div className="inline-block px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 mb-6 mt-4">
              Smart Medical & Clinic SaaS Platform
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              Smart Patient 
              <span className="text-teal-500"> Management </span>
              For Clinics & Doctors
            </h1>

            <p className="mt-8 text-gray-300 text-xl leading-relaxed max-w-xl">
              Manage appointments, patient records, digital prescriptions, billing, and clinic earnings 
              from one modern platform. Perfect for private practices, clinics, and health centers.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link href="/register-provider">
                <button className="bg-teal-500 hover:bg-teal-600 transition px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-teal-500/30">
                  Start Free Trial
                </button>
              </Link>

              <a href="https://www.youtube.com/watch?v=HU3jMu-pzH0" target="_blank" rel="noopener noreferrer">
                <button className="border border-white/20 hover:bg-white/10 transition px-8 py-4 rounded-2xl font-semibold text-lg">
                  Live Demo
                </button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12">

              <div>
                <h2 className="text-3xl font-bold text-teal-400">500+</h2>
                <p className="text-gray-400">Practitioners</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-teal-400">20K+</h2>
                <p className="text-gray-400">Daily Bookings</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-teal-400">99.9%</h2>
                <p className="text-gray-400">Uptime</p>
              </div>

            </div>

          </div>

          {/* RIGHT DASHBOARD */}
          <div className="relative animate-float">

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">

              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-gray-400">Medical Dashboard</p>
                  <h3 className="text-2xl font-bold mt-2">
                    Royal Health Plaza
                  </h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center text-2xl">
                  🩺
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">

                <div className="bg-black/30 rounded-2xl p-5">
                  <p className="text-gray-400">Appointments</p>
                  <h2 className="text-4xl font-bold mt-3">248</h2>
                </div>

                <div className="bg-black/30 rounded-2xl p-5">
                  <p className="text-gray-400">Revenue</p>
                  <h2 className="text-4xl font-bold mt-3">₹3420</h2>
                </div>

                <div className="bg-black/30 rounded-2xl p-5 col-span-2">

                  <div className="flex justify-between mb-3">
                    <span>In-Clinic Visits</span>
                    <span>68%</span>
                  </div>

                  <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-4 w-[68%] rounded-full"></div>
                  </div>

                </div>

              </div>

              <div className="mt-6 bg-teal-500 rounded-2xl p-5 flex items-center gap-4">
                <div className="text-3xl">⚡</div>

                <div>
                  <h4 className="font-bold text-lg">
                    Live Patient Processing
                  </h4>

                  <p className="text-sm opacity-90">
                    Doctor cabin and reception desk synced instantly
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="py-28 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-bold">
              Powerful Features
            </h2>

            <p className="text-gray-400 mt-6 text-xl">
              Everything needed to run modern digital clinics
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 hover:border-teal-500/40 transition-all duration-300 rounded-3xl p-8 hover:-translate-y-2"
              >

                <div className="text-5xl mb-6">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 bg-white/5">

        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-bold">
              How It Works
            </h2>

          </div>

          <div className="space-y-8">

            {[
              "Doctor or clinic registers on the SaaS platform",
              "Add medical staff, consultant schedules, and services",
              "Patients book appointments via kiosk, QR code, or directly from mobile",
              "Doctor's dashboard receives appointment updates instantly",
              "Consultation charges processed securely online or offline",
              "Track operational analytics, prescription histories, and earnings",
              "Patients can instantly view their prescription details and queue status",
            ].map((step, i) => (

              <div
                key={i}
                className="flex items-center gap-6 bg-black/40 border border-white/10 rounded-3xl p-6"
              >

                <div className="min-w-[60px] h-[60px] rounded-full bg-teal-500 flex items-center justify-center text-2xl font-bold">
                  {i + 1}
                </div>

                <h3 className="text-xl font-semibold">
                  {step}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* PRICING */}
      <section className="py-28 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold">
              Pricing Plans
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {pricing.map((plan, i) => (

              <div
                key={i}
                className={`rounded-3xl p-10 border ${
                  i === 1
                    ? "bg-teal-500 border-teal-400 scale-105"
                    : "bg-white/5 border-white/10"
                }`}
              >

                <h3 className="text-3xl font-bold">
                  {plan.name}
                </h3>

                <div className="mt-8 text-6xl font-black">
                  {plan.price}
                </div>

                <ul className="space-y-4 mt-10 text-lg">
                  <li>✔ Unlimited Appointments</li>
                  <li>✔ QR Code Check-In</li>
                  <li>✔ Analytics Dashboard</li>
                  <li>✔ Digital Prescriptions</li>
                </ul>

                <Link href="/register-provider">
                  <button className="mt-10 w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition">
                    Choose Plan
                  </button>
                </Link>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-32 px-6">

        <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-teal-500 to-blue-600 rounded-[40px] p-16">

          <h2 className="text-5xl font-black leading-tight">
            Ready To Transform Your Medical Practice?
          </h2>

          <p className="mt-6 text-xl text-white/90">
            Launch your smart clinical management and patient ordering platform today.
          </p>

          <Link href="/register-provider">
            <button className="mt-10 bg-black hover:bg-gray-900 transition px-10 py-5 rounded-2xl text-xl font-bold">
              Get Started Now
            </button>
          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <Footer />

    </main>
  );
}