import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const features = [
  { title: "🧠 Episodic Memory", desc: "Remembers *how you felt*, not just *what you did*." },
  { title: "🔮 Mistake Prediction", desc: "Warns you *before* you repeat the same mistake." },
  { title: "🎨 Sensory Personalization", desc: "Changes your environment to match your mood." },
  { title: "🤝 Deep Social Intelligence", desc: "Analyzes the health of your relationships." },
  { title: "💭 Critical Thinking Coach", desc: "Uses the Socratic method to challenge your decisions." },
];

export default function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
  <h2 className="text-3xl font-bold mb-8 text-center">Our Features</h2>
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
