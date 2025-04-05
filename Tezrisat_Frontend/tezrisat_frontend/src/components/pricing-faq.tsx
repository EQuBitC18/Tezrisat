// @ts-ignore
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PricingFaq() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
      <div className="bg-white/30 backdrop-blur-sm rounded-3xl border border-teal-200/50 shadow-xl overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-b border-teal-200/30 px-6">
            <AccordionTrigger className="text-teal-900 hover:text-teal-700 py-6 text-lg font-medium">
              How does the microcourse generator work?
            </AccordionTrigger>
            <AccordionContent className="text-teal-800 pb-6">
              Our microcourse generator uses advanced AI to create customized learning materials on any topic. You
              simply input your desired topic, learning objectives, and preferred style, and our LLM creates a
              structured microcourse with relevant content, examples, and assessments tailored to your specifications.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-b border-teal-200/30 px-6">
            <AccordionTrigger className="text-teal-900 hover:text-teal-700 py-6 text-lg font-medium">
              Can I customize the AI-generated content?
            </AccordionTrigger>
            <AccordionContent className="text-teal-800 pb-6">
              Yes! All plans allow for content customization, with higher tiers offering more advanced options. You can
              edit the generated content, add your own materials, adjust the learning path, and even fine-tune the AI
              model to better match your specific teaching or learning style.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-b border-teal-200/30 px-6">
            <AccordionTrigger className="text-teal-900 hover:text-teal-700 py-6 text-lg font-medium">
              What counts as one microcourse?
            </AccordionTrigger>
            <AccordionContent className="text-teal-800 pb-6">
              A microcourse is defined as a single learning module on a specific topic, typically containing 3-7 lessons
              with associated materials. Each generation or significant revision counts as one microcourse against your
              monthly limit. Minor edits and updates to existing courses don't count as additional usage.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border-b border-teal-200/30 px-6">
            <AccordionTrigger className="text-teal-900 hover:text-teal-700 py-6 text-lg font-medium">
              Can I switch between plans?
            </AccordionTrigger>
            <AccordionContent className="text-teal-800 pb-6">
              You can upgrade your plan at any time, with the new features becoming immediately available. If you need
              to downgrade, the change will take effect at the start of your next billing cycle. For annual plans, you
              can upgrade mid-term by paying the prorated difference.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5" className="px-6">
            <AccordionTrigger className="text-teal-900 hover:text-teal-700 py-6 text-lg font-medium">
              Is there a free trial available?
            </AccordionTrigger>
            <AccordionContent className="text-teal-800 pb-6">
              Yes, we offer a 7-day free trial of our Pro plan for new users. This gives you access to all Pro features
              including 5 microcourse generations to test the platform. No credit card is required to start your trial,
              and you can upgrade to a paid plan at any time.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

