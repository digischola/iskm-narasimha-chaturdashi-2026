import heroImage from "@/assets/narasimha-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Lord Narasimha - Divine Avatar of Vishnu"
            width={1920}
            height={1024}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-saffron tracking-[0.35em] uppercase text-sm md:text-base mb-6 font-medium" style={{ fontFamily: 'var(--font-display)' }}>
            ॐ नृसिंहाय नमः
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gold-gradient glow-gold leading-tight mb-6">
            Narasimha Chaturdashi
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto leading-relaxed mb-4">
            Celebrating the divine appearance of Lord Narasimha — the fierce protector and fourth avatar of Lord Vishnu
          </p>
          <div className="mt-8 inline-block border border-gold/30 rounded-lg px-8 py-4 bg-card/50 backdrop-blur-sm">
            <p className="text-muted-foreground text-sm tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>This Year</p>
            <p className="text-primary text-2xl md:text-3xl font-semibold mt-1" style={{ fontFamily: 'var(--font-display)' }}>May 11, 2026</p>
            <p className="text-muted-foreground text-sm mt-1">Vaishakha Shukla Chaturdashi</p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-primary text-center mb-4">The Sacred Legend</h2>
          <div className="w-24 h-0.5 bg-primary/40 mx-auto mb-12" />

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card/60 border border-gold/20 rounded-xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>The Demon King</h3>
              <p className="text-foreground/80 text-lg leading-relaxed">
                Hiranyakashipu, granted a powerful boon by Lord Brahma, became invincible — he could not be killed by man or animal, inside or outside, by day or by night. Drunk with power, he declared himself God and forbade all worship of Vishnu.
              </p>
            </div>
            <div className="bg-card/60 border border-gold/20 rounded-xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>The Devoted Son</h3>
              <p className="text-foreground/80 text-lg leading-relaxed">
                His own son, Prahlada, was an unwavering devotee of Lord Vishnu. Despite terrible punishments and threats, young Prahlada's faith never wavered. He proclaimed that Vishnu was everywhere — in every atom of creation.
              </p>
            </div>
            <div className="md:col-span-2 bg-card/60 border border-gold/20 rounded-xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>The Divine Manifestation</h3>
              <p className="text-foreground/80 text-lg leading-relaxed">
                When Hiranyakashipu struck a pillar demanding to know if Vishnu was there, Lord Narasimha — half-man, half-lion — burst forth at twilight, on the threshold, placing the demon on His lap. Thus, every condition of the boon was honored, and dharma was restored. This sacred event is celebrated as <span className="text-primary font-semibold">Narasimha Chaturdashi</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rituals Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Observances & Rituals</h2>
          <div className="w-24 h-0.5 bg-primary/40 mx-auto mb-12" />

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { title: "Fasting", desc: "Devotees observe a strict fast from sunrise, breaking it only after moonrise with fruits and milk." },
              { title: "Night Vigil", desc: "Staying awake through the night chanting Narasimha mantras and reading sacred texts." },
              { title: "Puja & Abhishekam", desc: "Special worship with sandalwood paste, tulsi, and offering of flowers to Lord Narasimha." },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-gold/20 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-primary mb-3" style={{ fontFamily: 'var(--font-display)' }}>{item.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mantra Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-12">Sacred Mantra</h2>
          <div className="bg-card/60 border border-gold/30 rounded-2xl p-10 md:p-14 backdrop-blur-sm">
            <p className="text-2xl md:text-4xl text-primary leading-relaxed mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              उग्रं वीरं महाविष्णुं<br />
              ज्वलन्तं सर्वतोमुखम्।<br />
              नृसिंहं भीषणं भद्रं<br />
              मृत्युमृत्युं नमाम्यहम्॥
            </p>
            <p className="text-muted-foreground text-base italic leading-relaxed max-w-lg mx-auto">
              "I bow to Lord Narasimha, the fierce, heroic form of Maha Vishnu, blazing in all directions — terrifying yet auspicious, the death of death itself."
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gold/10 text-center">
        <p className="text-muted-foreground text-sm">
          ॐ नमो भगवते नरसिंहाय • Narasimha Chaturdashi 2026
        </p>
      </footer>
    </div>
  );
};

export default Index;
