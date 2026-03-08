import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.png";

export default function About() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImg} 
            alt="About Aura" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Our Story</h1>
          <p className="text-white/80 tracking-widest uppercase text-sm">Crafting Excellence Since 2018</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 container mx-auto px-4 max-w-4xl">
        <div className="space-y-12 text-center md:text-left">
          
          <div>
            <h2 className="text-2xl md:text-3xl font-serif mb-6">The Vision</h2>
            <p className="text-white/70 font-light leading-relaxed text-lg">
              3D GRILLS GENIUS was born out of a desire to bridge the gap between traditional fine jewelry and modern urban culture. We observed a landscape filled with mass-produced pieces lacking soul and decided to build a brand focused entirely on bespoke craftsmanship and uncompromising quality.
            </p>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div>
            <h2 className="text-2xl md:text-3xl font-serif mb-6">Uncompromising Quality</h2>
            <p className="text-white/70 font-light leading-relaxed text-lg mb-6">
              Every single piece that leaves our studio is meticulously handcrafted by master jewelers in London. We source only the finest materials—solid 14k and 18k gold, and ethically sourced, brilliant VVS diamonds. 
            </p>
            <p className="text-white/70 font-light leading-relaxed text-lg">
              Whether it's a custom set of diamond grillz or a timeless Cuban link chain, we approach every project with the same level of dedication and precision. We don't cut corners, and we don't plate over cheap metals.
            </p>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div>
            <h2 className="text-2xl md:text-3xl font-serif mb-6">The Bespoke Experience</h2>
            <p className="text-white/70 font-light leading-relaxed text-lg mb-8">
              We specialize in bringing your unique visions to life. Our bespoke service allows you to work directly with our design team to create 1-of-1 pieces that perfectly encapsulate your personal style.
            </p>
            <div className="text-center">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-none px-8 uppercase tracking-widest">
                Start a Custom Project
              </Button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}