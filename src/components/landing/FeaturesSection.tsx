import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const features = [
  { title: "🧠 الذاكرة العاطفية", desc: "يتذكر كيف شعرت، ليس فقط ماذا فعلت" },
  { title: "🔮 التنبؤ بالأخطاء", desc: "يحذرك قبل أن تكرر نفس الخطأ" },
  { title: "🎨 التخصيص متعدد الحواس", desc: "يغير بيئتك لتناسب حالتك المزاجية" },
  { title: "🤝 الذكاء الاجتماعي", desc: "يحلل علاقاتك ويساعدك على الحفاظ عليها" },
  { title: "💭 مساعد التفكير الناقد", desc: "لا يعطيك الإجابة، بل يساعدك على التفكير" },
];

export default function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">ميزاتنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="p-4">
              <CardHeader>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">{f.desc}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
