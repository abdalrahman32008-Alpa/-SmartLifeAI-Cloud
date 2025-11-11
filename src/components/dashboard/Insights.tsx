import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabaseClient"

export default function Insights() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      setError("")

      // Fetch last 5 mood logs and join with tasks (if related)
      const { data, error: fetchError } = await supabase
        .from("mood_logs")
        .select("mood_score, created_at, related_task_id, tasks(title)")
        .order("created_at", { ascending: false })
        .limit(5)

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setItems(data || [])
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch insights")
    } finally {
      setLoading(false)
    }
  }

  const scoreLabel = (score: number) => {
    switch (score) {
      case 5:
        return "Great"
      case 4:
        return "Good"
      case 3:
        return "Okay"
      case 2:
        return "Bad"
      case 1:
        return "Awful"
      default:
        return String(score)
    }
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Your First Insight</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-600">{error}</div>}
        {loading && <div className="text-slate-500">Loading...</div>}
        {!loading && items.length === 0 && <div className="text-slate-500">No recent moods yet.</div>}

        <ul className="space-y-2">
          {items.map((it: any, idx: number) => {
            const taskTitle = it.tasks && it.tasks.length ? it.tasks[0].title : null
            return (
              <li key={idx} className="text-slate-700">
                You felt '{it.mood_score}' ({scoreLabel(it.mood_score)}){taskTitle ? ` after completing '${taskTitle}'` : ""}.
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
