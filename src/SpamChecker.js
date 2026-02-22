// import React, { useState } from "react";
// import { API_BASE_URL } from "./constants";

// export default function SpamChecker({ user }) {
//   const [emailSubject, setEmailSubject] = useState("");
//   const [emailBody, setEmailBody] = useState("");
//   const [senderDomain, setSenderDomain] = useState("");
//   const [detectionMethods, setDetectionMethods] = useState([]);
//   const [llmResult, setLlmResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleDetectionMethodChange = (method) => {
//     setDetectionMethods((prevMethods) =>
//       prevMethods.includes(method)
//         ? prevMethods.filter((m) => m !== method)
//         : [...prevMethods, method]
//     );
//   };

//   const handleCheck = async () => {
//     setLoading(true);
//     setError(null);
//     setLlmResult(null);

//     if (detectionMethods.length === 0) {
//       setError("Please select at least one detection method.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/spam/detect`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${user?.token}`
//         },
//         body: JSON.stringify({
//           domain: senderDomain,
//           subject: emailSubject,
//           body: emailBody,
//           detectionMethods,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to detect spam.");
//       }

//       setLlmResult(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">AI Spam Checker</h2>

//       {/* Sender Domain Input */}
//       <div className="mb-4">
//         <label htmlFor="senderDomain" className="block mb-2 text-gray-600 font-medium">
//           Sender Domain (e.g., example.com):
//         </label>
//         <input
//           type="text"
//           id="senderDomain"
//           value={senderDomain}
//           onChange={(e) => setSenderDomain(e.target.value)}
//           placeholder="Enter sender's domain"
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         />
//       </div>

//       {/* Email Subject Input */}
//       <div className="mb-4">
//         <label htmlFor="emailSubject" className="block mb-2 text-gray-600 font-medium">
//           Email Subject:
//         </label>
//         <input
//           type="text"
//           id="emailSubject"
//           value={emailSubject}
//           onChange={(e) => setEmailSubject(e.target.value)}
//           placeholder="Enter email subject"
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         />
//       </div>

//       {/* Email Body Input */}
//       <div className="mb-6">
//         <label htmlFor="emailBody" className="block mb-2 text-gray-600 font-medium">
//           Email Body:
//         </label>
//         <textarea
//           id="emailBody"
//           rows={8}
//           placeholder="Paste email body here..."
//           value={emailBody}
//           onChange={(e) => setEmailBody(e.target.value)}
//           className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         />
//       </div>

//       {/* Detection Methods Checkboxes */}
//       <div className="mb-6">
//         <span className="block mb-2 text-gray-600 font-medium">Analyze by:</span>
//         <div className="flex flex-wrap gap-4">
//           <label className="inline-flex items-center">
//             <input
//               type="checkbox"
//               className="form-checkbox h-5 w-5 text-indigo-600"
//               checked={detectionMethods.includes("domain")}
//               onChange={() => handleDetectionMethodChange("domain")}
//             />
//             <span className="ml-2 text-gray-700">Domain</span>
//           </label>
//           <label className="inline-flex items-center">
//             <input
//               type="checkbox"
//               className="form-checkbox h-5 w-5 text-indigo-600"
//               checked={detectionMethods.includes("subject")}
//               onChange={() => handleDetectionMethodChange("subject")}
//             />
//             <span className="ml-2 text-gray-700">Subject</span>
//           </label>
//           <label className="inline-flex items-center">
//             <input
//               type="checkbox"
//               className="form-checkbox h-5 w-5 text-indigo-600"
//               checked={detectionMethods.includes("body")}
//               onChange={() => handleDetectionMethodChange("body")}
//             />
//             <span className="ml-2 text-gray-700">Body</span>
//           </label>
//         </div>
//       </div>

//       {/* Check Button */}
//       <button
//         onClick={handleCheck}
//         disabled={loading}
//         className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
//       >
//         {loading ? "Checking..." : "Check Email for Spam"}
//       </button>

//       {/* Result Display */}
//       {loading && (
//         <div className="mt-6 p-4 bg-blue-100 border border-blue-200 rounded-lg text-blue-800">
//           Loading... Analyzing email for spam.
//         </div>
//       )}

//       {error && (
//         <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-800">
//           Error: {error}
//         </div>
//       )}

//       {llmResult && (
//         <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
//           <h4 className="text-lg font-semibold mb-2">
//             Spam Detection Result:{" "}
//             <span className={llmResult.isSpam ? "text-red-600" : "text-green-600"}>
//               {llmResult.isSpam ? "SPAM" : "NOT SPAM"}
//             </span>
//           </h4>
//           <p className="font-medium text-gray-700">
//             <strong>Reason:</strong> {llmResult.reason}
//           </p>
//           <p className="text-sm text-gray-500 mt-2">
//             LLM Raw Response: {llmResult.llmResponse}
//           </p>
//         </div>
//       )}
//     </section>
//   );
// }

// import React, { useState } from "react";
// import { analyzeEmail } from "./spamAnalyzer";

// export default function SpamChecker() {
//   const [emailSubject, setEmailSubject] = useState("");
//   const [emailBody, setEmailBody] = useState("");
//   const [senderDomain, setSenderDomain] = useState("");
//   const [detectionMethods, setDetectionMethods] = useState([]);

//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleDetectionMethodChange = (method) => {
//     setDetectionMethods((prev) =>
//       prev.includes(method)
//         ? prev.filter((m) => m !== method)
//         : [...prev, method]
//     );
//   };

//   const handleCheck = () => {
//     setLoading(true);
//     setError(null);
//     setResult(null);

//     if (detectionMethods.length === 0) {
//       setError("Please select at least one detection method.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const analysis = analyzeEmail({
//         subject: detectionMethods.includes("subject") ? emailSubject : "",
//         body: detectionMethods.includes("body") ? emailBody : "",
//         sender: detectionMethods.includes("domain") ? senderDomain : "",
//       });

//       setResult(analysis);
//     } catch (err) {
//       console.error(err);
//       setError("Analysis failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//         AI Spam Checker
//       </h2>

//       {/* Domain */}
//       <div className="mb-4">
//         <label className="block mb-2 text-gray-600 font-medium">
//           Sender Domain / Email
//         </label>
//         <input
//           type="text"
//           value={senderDomain}
//           onChange={(e) => setSenderDomain(e.target.value)}
//           placeholder="example@domain.com"
//           className="w-full px-4 py-2 border rounded-lg"
//         />
//       </div>

//       {/* Subject */}
//       <div className="mb-4">
//         <label className="block mb-2 text-gray-600 font-medium">
//           Email Subject
//         </label>
//         <input
//           type="text"
//           value={emailSubject}
//           onChange={(e) => setEmailSubject(e.target.value)}
//           placeholder="Enter subject"
//           className="w-full px-4 py-2 border rounded-lg"
//         />
//       </div>

//       {/* Body */}
//       <div className="mb-6">
//         <label className="block mb-2 text-gray-600 font-medium">
//           Email Body
//         </label>
//         <textarea
//           rows={8}
//           value={emailBody}
//           onChange={(e) => setEmailBody(e.target.value)}
//           placeholder="Paste email body here..."
//           className="w-full px-4 py-3 border rounded-lg"
//         />
//       </div>

//       {/* Detection Methods */}
//       <div className="mb-6">
//         <span className="block mb-2 text-gray-600 font-medium">
//           Analyze by:
//         </span>

//         <div className="flex gap-4 flex-wrap">
//           <label>
//             <input
//               type="checkbox"
//               checked={detectionMethods.includes("domain")}
//               onChange={() => handleDetectionMethodChange("domain")}
//             />{" "}
//             Domain / Sender
//           </label>

//           <label>
//             <input
//               type="checkbox"
//               checked={detectionMethods.includes("subject")}
//               onChange={() => handleDetectionMethodChange("subject")}
//             />{" "}
//             Subject
//           </label>

//           <label>
//             <input
//               type="checkbox"
//               checked={detectionMethods.includes("body")}
//               onChange={() => handleDetectionMethodChange("body")}
//             />{" "}
//             Email Body
//           </label>
//         </div>
//       </div>

//       {/* Button */}
//       <button
//         onClick={handleCheck}
//         disabled={loading}
//         className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
//       >
//         {loading ? "Checking..." : "Check Email for Spam"}
//       </button>

//       {/* Error */}
//       {error && (
//         <div className="mt-6 p-4 bg-red-100 border rounded-lg text-red-700">
//           {error}
//         </div>
//       )}

//       {/* RESULTS */}
//       {result && (
//         <div className="mt-6 space-y-4">

//           {/* FINAL RESULT */}
//           <div className="p-4 bg-yellow-50 border rounded-lg">
//             <h4 className="font-semibold text-lg">⭐ Final Result</h4>
//             <p>Spam Score: {result.finalScore}%</p>
//             <p>Risk Level: {result.risk}</p>
//           </div>

//           {/* SUBJECT */}
//           {result.subject && (
//             <div className="p-4 bg-blue-50 border rounded-lg">
//               <h4 className="font-semibold text-lg">Subject Analysis</h4>
//               <p>Score: {result.subject.score}%</p>
//             </div>
//           )}

//           {/* BODY */}
//           {result.body && (
//             <div className="p-4 bg-green-50 border rounded-lg">
//               <h4 className="font-semibold text-lg">Body Analysis</h4>
//               <p>Score: {result.body.score}%</p>
//             </div>
//           )}

//           {/* SENDER */}
//           {result.sender && (
//             <div className="p-4 bg-purple-50 border rounded-lg">
//               <h4 className="font-semibold text-lg">Sender Analysis</h4>
//               <p>Score: {result.sender.score}%</p>
//             </div>
//           )}

//         </div>
//       )}
//     </section>
//   );
// }

import React, { useState } from "react";
import { analyzeEmail } from "./spamAnalyzer"; // your existing spam analysis util
import toast from "react-hot-toast";

export default function SpamChecker({ currentUser }) {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [senderDomain, setSenderDomain] = useState("");
  const [detectionMethods, setDetectionMethods] = useState([]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDetectionMethodChange = (method) => {
    setDetectionMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method],
    );
  };

  // Save email to backend
  const saveEmail = async () => {
    try {
        const currentUser = JSON.parse(localStorage.getItem("user"));

      const res = await fetch("http://localhost:5000/emailRecord/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: currentUser ? `Bearer ${currentUser.token}` : "",
        },
        credentials: "include",
        body: JSON.stringify({
          // user: currentUser || "Anonymous",
          email: senderDomain,
          subject: emailSubject,
          body: emailBody,
          EmailType : "incoming"
        }),
      });
      const data = await res.json();

      console.log("data : ", data);
      // toast.success(data.message)
      if (!data.success) {
        toast.error("Failed to save email");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while saving email");
    }
  };

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    if (detectionMethods.length === 0) {
      setError("Please select at least one detection method.");
      setLoading(false);
      return;
    }

    try {
      // Save email first
      await saveEmail();

      // Run spam analysis
      const analysis = analyzeEmail({
        subject: detectionMethods.includes("subject") ? emailSubject : "",
        body: detectionMethods.includes("body") ? emailBody : "",
        sender: detectionMethods.includes("domain") ? senderDomain : "",
      });

      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        AI Spam Checker
      </h2>

      {/* Domain */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-600 font-medium">
          Sender Domain / Email
        </label>
        <input
          type="text"
          value={senderDomain}
          onChange={(e) => setSenderDomain(e.target.value)}
          placeholder="example@domain.com"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Subject */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-600 font-medium">
          Email Subject
        </label>
        <input
          type="text"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          placeholder="Enter subject"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Body */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-600 font-medium">
          Email Body
        </label>
        <textarea
          rows={8}
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          placeholder="Paste email body here..."
          className="w-full px-4 py-3 border rounded-lg"
        />
      </div>

      {/* Detection Methods */}
      <div className="mb-6">
        <span className="block mb-2 text-gray-600 font-medium">
          Analyze by:
        </span>

        <div className="flex gap-4 flex-wrap">
          <label>
            <input
              type="checkbox"
              checked={detectionMethods.includes("domain")}
              onChange={() => handleDetectionMethodChange("domain")}
            />{" "}
            Domain / Sender
          </label>

          <label>
            <input
              type="checkbox"
              checked={detectionMethods.includes("subject")}
              onChange={() => handleDetectionMethodChange("subject")}
            />{" "}
            Subject
          </label>

          <label>
            <input
              type="checkbox"
              checked={detectionMethods.includes("body")}
              onChange={() => handleDetectionMethodChange("body")}
            />{" "}
            Email Body
          </label>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleCheck}
        disabled={loading}
        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
      >
        {loading ? "Checking..." : "Check Email for Spam"}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* FINAL RESULT */}
          <div className="p-4 bg-yellow-50 border rounded-lg">
            <h4 className="font-semibold text-lg">⭐ Final Result</h4>
            <p>Spam Score: {result.finalScore}%</p>
            <p>Risk Level: {result.risk}</p>
          </div>

          {/* SUBJECT */}
          {result.subject && (
            <div className="p-4 bg-blue-50 border rounded-lg">
              <h4 className="font-semibold text-lg">Subject Analysis</h4>
              <p>Score: {result.subject.score}%</p>
            </div>
          )}

          {/* BODY */}
          {result.body && (
            <div className="p-4 bg-green-50 border rounded-lg">
              <h4 className="font-semibold text-lg">Body Analysis</h4>
              <p>Score: {result.body.score}%</p>
            </div>
          )}

          {/* SENDER */}
          {result.sender && (
            <div className="p-4 bg-purple-50 border rounded-lg">
              <h4 className="font-semibold text-lg">Sender Analysis</h4>
              <p>Score: {result.sender.score}%</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
