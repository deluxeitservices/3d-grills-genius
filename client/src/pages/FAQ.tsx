import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Frequently Asked Questions</h1>
          <div className="w-16 h-0.5 bg-primary mx-auto"></div>
        </div>

        <div className="space-y-12">
          
          <div>
            <h2 className="text-xl uppercase tracking-widest mb-6 text-primary">Orders & Shipping</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-white/20 bg-zinc-950 px-6">
                <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors text-left">Do you ship worldwide?</AccordionTrigger>
                <AccordionContent className="text-white/60 font-light leading-relaxed">
                  Yes, we offer fully insured worldwide shipping on all orders. International shipping rates are calculated at checkout.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-white/20 bg-zinc-950 px-6">
                <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors text-left">How long will my order take?</AccordionTrigger>
                <AccordionContent className="text-white/60 font-light leading-relaxed">
                  In-stock items ship within 2-3 business days. Custom grillz and bespoke orders typically take 3-4 weeks from the time we receive your mold or finalize the design.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-white/20 bg-zinc-950 px-6">
                <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors text-left">What is your return policy?</AccordionTrigger>
                <AccordionContent className="text-white/60 font-light leading-relaxed">
                  We accept returns on unworn, standard inventory items within 14 days of delivery. Due to their personalized nature, bespoke items and custom grillz are non-refundable.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h2 className="text-xl uppercase tracking-widest mb-6 text-primary">Custom Grillz</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-4" className="border-white/20 bg-zinc-950 px-6">
                <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors text-left">How do I get my mold done?</AccordionTrigger>
                <AccordionContent className="text-white/60 font-light leading-relaxed">
                  You can either book an appointment at our London studio for a professional fitting, or request a Home Molding Kit which includes detailed instructions to take your impression at home.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border-white/20 bg-zinc-950 px-6">
                <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors text-left">What karat gold do you use?</AccordionTrigger>
                <AccordionContent className="text-white/60 font-light leading-relaxed">
                  We offer solid 10k, 14k, and 18k gold for our grillz. We do not offer plating, ensuring your piece will last a lifetime without tarnishing or fading.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

        </div>
      </div>
    </div>
  );
}