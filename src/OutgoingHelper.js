// import React, { useState } from "react";
// import { getMoodSubject } from "./utils";
// import { API_BASE_URL } from "./constants";

// export default function OutgoingHelper({ user }) {
//   const [input, setInput] = useState("");
//   const [mood, setMood] = useState("formal");
//   const [subject, setSubject] = useState("");

//   const [analysisResult, setAnalysisResult] = useState(null);
//   const [analysisLoading, setAnalysisLoading] = useState(false);
//   const [analysisError, setAnalysisError] = useState(null);

//   const handleSuggest = () => setSubject(getMoodSubject(input, mood));

//   const handleAnalyze = async () => {
//     setAnalysisLoading(true);
//     setAnalysisError(null);
//     setAnalysisResult(null);

//     if (!input.trim()) {
//       setAnalysisError("Please enter email content to analyze.");
//       setAnalysisLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/outgoing-mail/analyze`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${user?.token}`
//         },
//         body: JSON.stringify({ emailContent: input }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to analyze outgoing mail.");
//       }

//       setAnalysisResult(data);
//     } catch (err) {
//       console.error("Error analyzing outgoing mail:", err);
//       setAnalysisError(err.message);
//     } finally {
//       setAnalysisLoading(false);
//     }
//   };

//   return (
//     <section className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Outgoing Email Helper & Spam Analyzer</h2>

//       {/* Email Draft */}
//       <div className="mb-6">
//         <label className="block mb-2 text-gray-600 font-medium">Email Draft:</label>
//         <textarea
//           rows={8}
//           placeholder="Paste your draft email here..."
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         />
//       </div>

//       {/* Mood Selection and Subject Suggestion */}
//       <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
//         <div className="flex-1 w-full">
//           <label className="block mb-1 text-gray-600 font-medium">Choose mood for subject:</label>
//           <select
//             value={mood}
//             onChange={e => setMood(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           >
//             <option value="formal">Formal</option>
//             <option value="friendly">Friendly</option>
//             <option value="corporate">Corporate</option>
//           </select>
//         </div>

//         <button
//           onClick={handleSuggest}
//           className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
//         >
//           Suggest Subject
//         </button>
//       </div>

//       {/* Subject Suggestion Result */}
//       {subject && (
//         <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
//           <h4 className="text-lg font-semibold mb-2 text-gray-800">Suggested Subject:</h4>
//           <p className="text-gray-700">{subject}</p>
//         </div>
//       )}

//       {/* Outgoing Mail Analysis Button */}
//       <div className="mt-6">
//         <button
//           onClick={handleAnalyze}
//           disabled={analysisLoading}
//           className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto disabled:opacity-50"
//         >
//           {analysisLoading ? "Analyzing..." : "Analyze Email for Spam Characteristics"}
//         </button>
//       </div>

//       {/* Analysis Result Display */}
//       {analysisLoading && (
//         <div className="mt-6 p-4 bg-blue-100 border border-blue-200 rounded-lg text-blue-800">
//           Loading... Analyzing your email for spam characteristics.
//         </div>
//       )}

//       {analysisError && (
//         <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-800">
//           Error: {analysisError}
//         </div>
//       )}

//       {analysisResult && (
//         <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
//           <h4 className="text-lg font-semibold mb-2 text-gray-800">Analysis Result:</h4>
//           <p className="font-medium text-gray-700">
//             <strong>Spam-Free Score:</strong> {analysisResult.spamFreeScore}/100
//           </p>
//           <p className="font-medium text-gray-700">
//             <strong>Remark:</strong> {analysisResult.remark}
//           </p>

//           {analysisResult.spamKeywords && analysisResult.spamKeywords.length > 0 && (
//             <div className="mt-4">
//               <h5 className="font-semibold text-gray-800">Identified Keywords & Suggestions:</h5>
//               <ul className="list-disc pl-5 text-gray-700">
//                 {analysisResult.spamKeywords.map((item, index) => (
//                   <li key={index}>
//                     "<strong>{item.keyword}</strong>" - Suggestion: "<em>{item.suggestion}</em>"
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {analysisResult.llmRawResponse && (
//             <p className="text-sm text-gray-500 mt-4">
//               LLM Raw Response: {analysisResult.llmRawResponse}
//             </p>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }

// OutgoingHelper.js
// import React, { useState } from "react";
import { analyzeEmail, generateSubjectLines } from "./spamAnalyzer.js"; // your spam functions

// export default function OutgoingHelper() {
//   const [emailContent, setEmailContent] = useState("");
//   const [tone, setTone] = useState("professional");
//   const [generatedSubjects, setGeneratedSubjects] = useState([]);
//   const [analysisResult, setAnalysisResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Generate subject lines
//   const handleGenerateSubjects = () => {
//     if (!emailContent.trim()) return;
//     setLoading(true);

//     setTimeout(() => {
//       const subjects = generateSubjectLines(emailContent, tone);
//       setGeneratedSubjects(subjects);
//       setLoading(false);
//       alert(`${subjects.length} subject lines generated!`);
//     }, 1000);
//   };

//   // Analyze email for spam
//   const handleAnalyze = () => {
//     if (!emailContent.trim()) return;
//     const result = analyzeEmail({ subject: "", body: emailContent, sender: "" });
//     setAnalysisResult(result);
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Outgoing Email Helper & Spam Analyzer</h1>

//       {/* Email input */}
//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Email Content:</label>
//         <textarea
//           className="w-full p-3 border rounded-lg min-h-[150px]"
//           value={emailContent}
//           onChange={(e) => setEmailContent(e.target.value)}
//           placeholder="Paste your email content here..."
//         />
//         <p className="text-sm text-gray-500 mt-1">
//           {emailContent.length} characters • {emailContent.split(" ").filter(Boolean).length} words
//         </p>
//       </div>

//       {/* Tone selector */}
//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Tone / Style:</label>
//         <select
//           className="w-full p-2 border rounded-lg"
//           value={tone}
//           onChange={(e) => setTone(e.target.value)}
//         >
//           <option value="professional">Professional</option>
//           <option value="casual">Casual</option>
//           <option value="urgent">Urgent</option>
//           <option value="friendly">Friendly</option>
//           <option value="formal">Formal</option>
//           <option value="creative">Creative</option>
//         </select>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-4 mb-6">
//         <button
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//           onClick={handleGenerateSubjects}
//           disabled={loading || !emailContent.trim()}
//         >
//           {loading ? "Generating..." : "Generate Subject Lines"}
//         </button>

//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={handleAnalyze}
//           disabled={!emailContent.trim()}
//         >
//           Analyze Email
//         </button>
//       </div>

//       {/* Generated subjects */}
//       {generatedSubjects.length > 0 && (
//         <div className="mb-6">
//           <h2 className="font-semibold mb-2">Generated Subject Lines:</h2>
//           <ul className="list-disc pl-5">
//             {generatedSubjects.map((s, idx) => (
//               <li key={idx} className="mb-1">
//                 {s}{" "}
//                 <button
//                   onClick={() => navigator.clipboard.writeText(s)}
//                   className="text-sm text-green-600 ml-2 hover:underline"
//                 >
//                   Copy
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Spam Analysis Result */}
//       {analysisResult && (
//         <div className="p-4 border rounded-lg bg-gray-100">
//           <h2 className="font-semibold mb-2">Spam Analysis Result:</h2>
//           <p>
//             <strong>Final Score:</strong> {analysisResult.finalScore} / 100
//           </p>
//           <p>
//             <strong>Risk Level:</strong> {analysisResult.risk}
//           </p>
//           {analysisResult.subject?.issues.length > 0 && (
//             <div>
//               <strong>Subject Issues:</strong>
//               <ul className="list-disc pl-5">
//                 {analysisResult.subject.issues.map((i, idx) => (
//                   <li key={idx}>{i}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {analysisResult.body?.issues.length > 0 && (
//             <div>
//               <strong>Body Issues:</strong>
//               <ul className="list-disc pl-5">
//                 {analysisResult.body.issues.map((i, idx) => (
//                   <li key={idx}>{i}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {analysisResult.sender?.issues.length > 0 && (
//             <div>
//               <strong>Sender Issues:</strong>
//               <ul className="list-disc pl-5">
//                 {analysisResult.sender.issues.map((i, idx) => (
//                   <li key={idx}>{i}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import toast from "react-hot-toast";

// Make sure these exist in your utils
// import { generateSubjectLines, analyzeEmail } from "../utils/emailUtils";

export default function OutgoingHelper({ currentUser }) {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedSubjects, setGeneratedSubjects] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Save email to MongoDB
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
          // user: currentUser ,
          email: "", // optional if user enters email separately
          subject: "", // optional, could use generated subject
          body: emailContent,
          EmailType : "outgoing"
        }),
      });
      const data = await res.json();
      if (!data.success) toast.error("Failed to save email");
    } catch (err) {
      console.error(err);
      toast.error("Server error while saving email");
    }
  };

  // Generate subject lines
  const handleGenerateSubjects = async () => {
    if (!emailContent.trim()) return;
    setLoading(true);

    // Save the email
    await saveEmail();

    setTimeout(() => {
      const subjects = generateSubjectLines(emailContent, tone);
      setGeneratedSubjects(subjects);
      setLoading(false);
      toast.success(`${subjects.length} subject lines generated!`);
    }, 500);
  };

  // Analyze email for spam
  const handleAnalyze = async () => {
    if (!emailContent.trim()) return;

    // Save email
    await saveEmail();

    const result = analyzeEmail({
      subject: "",
      body: emailContent,
      sender: "",
    });
    setAnalysisResult(result);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Outgoing Email Helper & Spam Analyzer
      </h1>

      {/* Email input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email Content:</label>
        <textarea
          className="w-full p-3 border rounded-lg min-h-[150px]"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="Paste your email content here..."
        />
      </div>

      {/* Tone selector */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Tone / Style:</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="urgent">Urgent</option>
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
          <option value="creative">Creative</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={handleGenerateSubjects}
          disabled={loading || !emailContent.trim()}
        >
          {loading ? "Generating..." : "Generate Subject Lines"}
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAnalyze}
          disabled={!emailContent.trim()}
        >
          Analyze Email
        </button>
      </div>

      {/* Generated subjects */}
      {generatedSubjects.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Generated Subject Lines:</h2>
          <ul className="list-disc pl-5">
            {generatedSubjects.map((s, idx) => (
              <li key={idx} className="mb-1">
                {s}{" "}
                <button
                  onClick={() => navigator.clipboard.writeText(s)}
                  className="text-sm text-green-600 ml-2 hover:underline"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Spam Analysis Result */}
      {analysisResult && (
        <div className="p-4 border rounded-lg bg-gray-100">
          <h2 className="font-semibold mb-2">Spam Analysis Result:</h2>
          <p>
            <strong>Final Score:</strong> {analysisResult.finalScore} / 100
          </p>
          <p>
            <strong>Risk Level:</strong> {analysisResult.risk}
          </p>
        </div>
      )}
    </div>
  );
}
