import { useState, useRef, useEffect } from "react"
import type { FormEvent } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

type Message = {
  id: string
  sender: "user" | "assistant"
  text: string
}

export default function AiCoach() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // scroll to bottom when messages change
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = {
      id: String(Date.now()) + "-u",
      sender: "user",
      text: input.trim(),
    }

    setInput("")
    setLoading(true)

    try {
      // Get current user token for context
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Call Supabase Edge Function with auth header for context
      const { data, error } = await supabase.functions.invoke("ai-coach", {
        body: { prompt: userMsg.text },
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : "",
        },
      })

      if (error) throw error

      const replyText = data?.reply || "(No response)"

      const aiMsg: Message = {
        id: String(Date.now()) + "-a",
        sender: "assistant",
        text: replyText,
      }

      setMessages((s) => [...s, userMsg, aiMsg])
    } catch (err: any) {
      const errMsg: Message = {
        id: String(Date.now()) + "-e",
        sender: "assistant",
        text: "Sorry, I couldn't reach the AI service.",
      }
      setMessages((s) => [...s, errMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Critical Thinking Coach</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[60vh]">
            <div
              ref={messagesRef}
              className="flex-1 overflow-auto p-4 space-y-3 bg-white rounded border border-slate-100"
            >
              {messages.length === 0 ? (
                <div className="text-slate-500">Ask me anything — I'll help you think deeper.</div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[80%] p-3 rounded-lg ${
                      m.sender === "user" ? "bg-primary/10 self-end text-right" : "bg-slate-100 self-start"
                    }`}
                  >
                    <div className="text-sm text-slate-800">{m.text}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={sendMessage} className="mt-4 flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Thinking..." : "Send"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
