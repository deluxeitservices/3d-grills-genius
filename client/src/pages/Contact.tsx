import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Contact Us</h1>
          <div className="w-16 h-0.5 bg-white mx-auto mb-6"></div>
          <p className="text-white/60 font-light max-w-2xl mx-auto">
            Have a question about an order, need a bespoke quote, or want to book an appointment? Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-10">
            <h2 className="text-2xl font-serif border-b border-white/10 pb-4 mb-6">Get In Touch</h2>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg uppercase tracking-wider mb-2">Our Studio</h3>
                <p className="text-white/60 font-light leading-relaxed">
                  124 Luxury Lane<br />
                  Hatton Garden, London<br />
                  EC1N 8AA<br />
                  (By Appointment Only)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg uppercase tracking-wider mb-2">Phone</h3>
                <p className="text-white/60 font-light leading-relaxed">
                  +44 (0) 20 7123 4567<br />
                  Mon-Fri: 10am - 6pm
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg uppercase tracking-wider mb-2">Email</h3>
                <p className="text-white/60 font-light leading-relaxed">
                  info@aurajewellery.com<br />
                  bespoke@aurajewellery.com
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-950 p-8 border border-white/5">
            <h2 className="text-2xl font-serif mb-6">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">First Name</label>
                  <Input className="bg-black border-white/20 rounded-none focus-visible:border-white text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Last Name</label>
                  <Input className="bg-black border-white/20 rounded-none focus-visible:border-white text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-white/60">Email</label>
                <Input type="email" className="bg-black border-white/20 rounded-none focus-visible:border-white text-white" />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-white/60">Subject</label>
                <select className="w-full h-10 bg-black border border-white/20 rounded-none text-white px-3 focus:outline-none focus:border-white">
                  <option>General Enquiry</option>
                  <option>Bespoke Order</option>
                  <option>Order Status</option>
                  <option>Book Appointment</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-white/60">Message</label>
                <Textarea className="bg-black border-white/20 rounded-none focus-visible:border-white text-white min-h-[150px]" />
              </div>

              <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-none py-6 uppercase tracking-widest">
                Send Message
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}