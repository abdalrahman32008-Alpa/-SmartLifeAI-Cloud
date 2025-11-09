import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">الأسئلة الشائعة</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>ما الفرق بينكم وبين Notion؟</AccordionTrigger>
            <AccordionContent>
              Notion يدير المعلومات، نحن نولد الحكمة. نحن نركز على "لماذا" تفعل، وليس فقط "ماذا" تفعل.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>هل بياناتي آمنة؟</AccordionTrigger>
            <AccordionContent>
              نعم. الخصوصية هي أولويتنا. 80% من بياناتك العاطفية تُعالج على جهازك (On-Device) ولا نراها أبداً.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
