import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

export default function HeroSection() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleJoin(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.from("waitlist_users").insert({ email }).select();
      if (error) throw error;
      setMessage("شكرًا! تم إضافتك إلى قائمة الانتظار.");
      setEmail("");
      // Keep the dialog open briefly so the user sees the success message, then auto-close
      setTimeout(() => setOpen(false), 1500);
    } catch (err: any) {
      // Supabase returns useful messages, but normalize fallback
      setMessage(err?.message || "حدث خطأ، حاول لاحقًا.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">نظام التشغيل الذي يفهم حياتك</h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8">لا تدير مهامك فقط. افهم نفسك. توقع أخطاءك. اتخذ قرارات أفضل.</p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-500">انضم إلى قائمة الانتظار</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>انضم إلى قائمة الانتظار</DialogTitle>
              <DialogDescription>أدخل بريدك الإلكتروني وسنضيفك إلى القائمة.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleJoin} className="mt-4 space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={loading}>{loading ? "جاري الإرسال..." : "انضم"}</Button>
                <Button variant="ghost" onClick={() => setOpen(false)}>إلغاء</Button>
              </div>
              {message && <p className="text-sm text-slate-400">{message}</p>}
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
