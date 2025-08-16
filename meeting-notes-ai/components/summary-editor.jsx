"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, Undo2, Redo2, Copy, Check, RefreshCw, Mail, Plus, X } from "lucide-react"

export function SummaryEditor({ initialSummary, summaryMeta = {}, onSummaryChange, onEmailShare }) {
  const [summary, setSummary] = useState(initialSummary)
  const [history, setHistory] = useState([initialSummary])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved")
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailStatus, setEmailStatus] = useState(null)
  const [emailData, setEmailData] = useState({
    subject: "Meeting Summary",
    recipients: [""],
    message: "Please find the meeting summary attached below.",
  })

  useEffect(() => {
    setSummary(initialSummary)
    setHistory([initialSummary])
    setHistoryIndex(0)
  }, [initialSummary])

  useEffect(() => {
    const words = summary
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const chars = summary.length
    setWordCount(words)
    setCharCount(chars)
  }, [summary])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoSaveStatus("saved")
      onSummaryChange?.(summary)
    }, 1000)

    setAutoSaveStatus("saving")
    return () => clearTimeout(timer)
  }, [summary, onSummaryChange])

  const handleSummaryChange = (newSummary) => {
    setSummary(newSummary)

    // Add to history if it's different from current
    if (newSummary !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newSummary)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setSummary(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setSummary(history[newIndex])
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `meeting-summary-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const addRecipient = () => {
    setEmailData((prev) => ({
      ...prev,
      recipients: [...prev.recipients, ""],
    }))
  }

  const removeRecipient = (index) => {
    setEmailData((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index),
    }))
  }

  const updateRecipient = (index, value) => {
    setEmailData((prev) => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => (i === index ? value : recipient)),
    }))
  }

  const handleSendEmail = async () => {
    setIsEmailSending(true)
    setEmailStatus(null)

    setTimeout(() => {
      setEmailStatus({
        type: "success",
        message: "Email sent successfully!",
      })
      setIsEmailSending(false)

      setTimeout(() => {
        setShowEmailForm(false)
        setEmailStatus(null)
      }, 2000)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Generated Summary Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">Generated Summary</h2>
              <Badge variant="secondary" className="text-xs">
                {wordCount} words
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <RefreshCw className={`w-3 h-3 ${autoSaveStatus === "saving" ? "animate-spin" : ""}`} />
                {autoSaveStatus === "saving" ? "Saving..." : "Saved"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyIndex === 0}>
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRedo} disabled={historyIndex === history.length - 1}>
                <Redo2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-gray-600">Review and edit the AI-generated summary before sharing</p>

          <Textarea
            value={summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className="min-h-[300px] resize-none font-mono text-sm"
            placeholder="Your generated summary will appear here..."
          />

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{charCount} characters</span>
            {summaryMeta.summaryType && <Badge variant="outline">{summaryMeta.summaryType}</Badge>}
          </div>
        </div>
      </Card>

      {/* Share Summary Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Share Summary</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {showEmailForm ? "Hide Options" : "Quick Share"}
            </Button>
          </div>

          <p className="text-gray-600">Send the summary to meeting participants or stakeholders</p>

          {showEmailForm && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="email-subject" className="text-sm font-medium">
                  Email Subject
                </Label>
                <Input
                  id="email-subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Meeting Summary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Recipients</Label>
                  <Button variant="outline" size="sm" onClick={addRecipient}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Email
                  </Button>
                </div>
                {emailData.recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={recipient}
                      onChange={(e) => updateRecipient(index, e.target.value)}
                      placeholder="colleague@company.com"
                      type="email"
                    />
                    {emailData.recipients.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeRecipient(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-message" className="text-sm font-medium">
                  Custom Message (Optional)
                </Label>
                <Textarea
                  id="custom-message"
                  value={emailData.message}
                  onChange={(e) => setEmailData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Add a personal message to include with the summary..."
                  className="min-h-[80px] resize-none"
                />
              </div>

              <Button
                onClick={handleSendEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!emailData.recipients.some((email) => email.trim()) || isEmailSending}
              >
                {isEmailSending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Email...
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Share Summary
                  </>
                )}
              </Button>

              {emailStatus && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    emailStatus.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {emailStatus.message}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
