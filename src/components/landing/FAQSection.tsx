import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>What's the difference between this and Notion?</AccordionTrigger>
            <AccordionContent>
              Notion manages information. We generate wisdom. We focus on *why* you act, not just *what* you do.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Is my data safe?</AccordionTrigger>
            <AccordionContent>
              Yes. Privacy is our foundation. 80% of your emotional data is processed On-Device, and we never see it.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
