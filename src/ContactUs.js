// import React, { useState } from "react";

// export default function ContactUs({ user }) {
//   const [email, setEmail] = useState(user ? "" : "");
//   const [message, setMessage] = useState("");
//   const [sent, setSent] = useState(false);
//   const [err, setErr] = useState("");

//   const validate = () => {
//     if (!email || !/\S+@\S+\.\S+/.test(email)) return "Valid email required.";
//     if (!message || message.length < 10) return "Message must be at least 10 characters.";
//     return "";
//   };
// a
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const error = validate();
//     if (error) {
//       setErr(error);
//       return;
//     }
//     setSent(true);
//     setErr("");
//     setEmail("");
//     setMessage("");
//   };

//   return (
//     <section className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Us</h2>

//       {sent ? (
//         <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
//           Thank you for contacting us! We will get back to you soon.
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div>
//             <label className="block text-gray-600 font-medium mb-1">Your Email:</label>
//             <input
//               type="email"
//               value={email}
//               placeholder="your@email.com"
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600 font-medium mb-1">Your Message:</label>
//             <textarea
//               rows={5}
//               placeholder="How can we help you?"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//           </div>

//           {err && (
//             <div className="text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
//               {err}
//             </div>
//           )}

//           <button
//             type="submit"
//             className="mt-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
//           >
//             Send Message
//           </button>
//         </form>
//       )}
//     </section>
//   );
// }





import React, { useState } from "react";

export default function ContactUs({ user }) {
  const [email, setEmail] = useState(user ? "" : "");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false); // loading state

  const validate = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) return "Valid email required.";
    if (!message || message.length < 10) return "Message must be at least 10 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setErr(error);
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const res = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      const data = await res.json();
console.log("contact : " , data)
      if (data.success) {
        setSent(true);
        setEmail("");
        setMessage("");
      } else {
        setErr(data.msg || "Something went wrong");
      }
    } catch (error) {
      setErr("Server error. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Us</h2>

      {sent ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Thank you for contacting us! We will get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Your Email:</label>
            <input
              type="email"
              value={email}
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Your Message:</label>
            <textarea
              rows={5}
              placeholder="How can we help you?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {err && (
            <div className="text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 px-6 py-2 text-white font-semibold rounded-lg transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </section>
  );
}