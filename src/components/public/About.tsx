import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AboutMe } from '../../types/database';

export function About() {
  const [about, setAbout] = useState<AboutMe | null>(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    const { data } = await supabase
      .from('about_me')
      .select('*')
      .maybeSingle();

    if (data) {
      setAbout(data);
    }
  };

  if (!about) return null;

  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
            About Me
          </h2>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {about.bio}
              </p>

              {about.cv_url && (
                <div className="card-actions justify-center mt-8">
                  <a
                    href={about.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary gap-2"
                  >
                    <Download size={20} />
                    Download CV
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
