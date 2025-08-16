"use client"

import { useState, useRef } from "react"

export default function MeetingNotesPage() {
  const [transcript, setTranscript] = useState("")
  const [customInstructions, setCustomInstructions] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transcriptLoaded, setTranscriptLoaded] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailSubject, setEmailSubject] = useState("Meeting Summary")
  const [recipients, setRecipients] = useState([""])
  const [customMessage, setCustomMessage] = useState("")
  const [emailSending, setEmailSending] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        setTranscript(content)
        setTranscriptLoaded(true)
      }
      reader.readAsText(file)
    }
  }

  const handlePresetClick = (preset) => {
    const presets = {
      "Executive Summary":
        "Create a concise executive summary with key decisions, action items, and next steps. Format as bullet points for easy reading.",
      "Action Items":
        "Extract all action items, decisions made, and follow-up tasks. Include responsible parties and deadlines where mentioned.",
      "Technical Summary":
        "Focus on technical discussions, solutions proposed, and implementation details. Include any technical decisions or architecture changes.",
      "Meeting Minutes":
        "Create formal meeting minutes with attendees, agenda items discussed, decisions made, and action items. Use a professional format.",
    }
    setCustomInstructions(presets[preset])
  }

  const handleSummarize = async () => {
    if (!transcript.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcript,
          instructions:
            customInstructions ||
            "Create a concise summary with key points, decisions made, and action items. Format as bullet points for easy reading.",
        }),
      })

      if (!response.ok) throw new Error("Summarization failed")

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error("Summarization error:", error)
      setSummary("Sorry, there was an error generating the summary. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addRecipient = () => {
    setRecipients([...recipients, ""])
  }

  const updateRecipient = (index, value) => {
    const newRecipients = [...recipients]
    newRecipients[index] = value
    setRecipients(newRecipients)
  }

  const removeRecipient = (index) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index))
    }
  }

  const handleSendEmail = async () => {
    setEmailSending(true)

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject,
          recipients: recipients.filter((email) => email.trim()),
          summary: summary,
          customMessage: customMessage,
        }),
      })

      if (response.ok) {
        setShowSuccessPopup(true)
        setShowEmailForm(false)
        setEmailSubject("Meeting Summary")
        setRecipients([""])
        setCustomMessage("")

        setTimeout(() => {
          setShowSuccessPopup(false)
        }, 3000)
      }
    } catch (error) {
      console.error("Email error:", error)
    } finally {
      setEmailSending(false)
    }
  }

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: "linear-gradient(135deg, #f8d7e2, #e6e6fa, #dbeafe, #ffffff)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">✨ AI-Powered</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Meeting Notes <span className="text-blue-600">Summarizer</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform lengthy meeting transcripts into actionable summaries with custom AI instructions
          </p>
        </div>

        {/* Process Steps */}
        <div className="flex justify-center items-center gap-4 py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <span className="text-sm font-medium text-green-700">Upload</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="text-sm font-medium text-blue-700">Customize</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <span className="text-sm font-medium text-purple-700">Generate</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              4
            </div>
            <span className="text-sm font-medium text-orange-700">Edit</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              5
            </div>
            <span className="text-sm font-medium text-indigo-700">Share</span>
          </div>
        </div>

        {/* Transcript Loaded Notification */}
        {transcriptLoaded && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📄</span>
              </div>
              <div>
                <p className="font-semibold text-blue-900">Transcript Loaded</p>
                <p className="text-blue-700 text-sm">{transcript.length} characters • Ready for summarization</p>
              </div>
            </div>
            <button onClick={() => setTranscriptLoaded(false)} className="text-blue-500 hover:text-blue-700">
              ✕
            </button>
          </div>
        )}

        {/* Meeting Transcript */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Meeting Transcript</h2>
          <p className="text-gray-600 mb-4">Paste your transcript directly or upload a file above</p>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your transcript here..."
            className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="mt-4 flex items-center justify-between">
            <input type="file" accept=".txt" onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Upload from computer
            </button>
            <span className="text-gray-500 text-sm">{transcript.length} characters</span>
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">💡</span>
            <h2 className="text-xl font-semibold text-gray-900">Custom Instructions</h2>
          </div>
          <p className="text-gray-600 mb-4">Tell the AI how to summarize your meeting transcript</p>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick presets:</p>
            <div className="flex flex-wrap gap-2">
              {["Executive Summary", "Action Items", "Technical Summary", "Meeting Minutes"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Create a concise summary with key points, decisions made, and action items. Format as bullet points for easy reading."
            className="w-full min-h-[100px] p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={handleSummarize}
            disabled={!transcript.trim() || isLoading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Summary...
              </>
            ) : (
              "Generate Summary"
            )}
          </button>
        </div>

        {/* Generated Summary */}
        {summary && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Generated Summary</h2>
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-sm">31 words</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <span className="text-lg">🔄</span>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <span className="text-lg">📥</span>
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Review and edit the AI-generated summary before sharing</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full min-h-[200px] bg-transparent border-none resize-none focus:outline-none"
              />
            </div>

            {/* Share Summary */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Share Summary</h3>
                <button
                  onClick={() => setShowEmailForm(!showEmailForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span className="text-sm">✉️</span>
                  {showEmailForm ? "Hide Options" : "Quick Share"}
                </button>
              </div>
              <p className="text-gray-600 mb-4">Send the summary to meeting participants or stakeholders</p>

              {showEmailForm && (
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                    {recipients.map((recipient, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="email"
                          value={recipient}
                          onChange={(e) => updateRecipient(index, e.target.value)}
                          placeholder="colleague@company.com"
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {recipients.length > 1 && (
                          <button
                            onClick={() => removeRecipient(index)}
                            className="px-3 py-2 text-red-600 hover:text-red-700"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addRecipient}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      + Add Email
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Message (Optional)</label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a personal message to include with the summary..."
                      className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleSendEmail}
                    disabled={emailSending || !recipients.some((email) => email.trim())}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {emailSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="text-sm">📤</span>
                        Share Summary
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Sent Successfully!</h3>
              <p className="text-gray-600">Your meeting summary has been shared with the recipients.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
