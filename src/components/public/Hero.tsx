import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { HeroSection } from '../../types/database';
import { User } from 'lucide-react';

export function Hero() {
  const [hero, setHero] = useState<HeroSection | null>(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    const { data } = await supabase
      .from('hero_section')
      .select('*')
      .maybeSingle();

    if (data) {
      setHero(data);
    }
  };

  if (!hero) return null;

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-4">
              {hero.name}
            </h1>
            <h2 className="text-2xl lg:text-3xl text-primary font-semibold mb-6">
              {hero.role}
            </h2>
            <p className="text-lg lg:text-xl text-base-content/70 max-w-2xl">
              {hero.description}
            </p>
            <div className="mt-8 flex gap-4 justify-center lg:justify-start">
              <a href="#projects" className="btn btn-primary">
                View Projects
              </a>
              <a href="#contact" className="btn btn-outline">
                Contact Me
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="avatar">
              <div className="w-64 lg:w-96 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {hero.profile_image_url ? (
                  <img src={hero.profile_image_url} alt={hero.name} />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-base-200">
                    <User size={120} className="text-base-content/30" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
