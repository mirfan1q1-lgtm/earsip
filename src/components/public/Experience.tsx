import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Experience as ExperienceType } from '../../types/database';

export function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true });

    if (data) {
      setExperiences(data);
    }
  };

  return (
    <section id="experience" className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
            Experience
          </h2>

          <div className="max-w-4xl mx-auto">
            {experiences.length === 0 ? (
              <div className="text-center text-base-content/50">
                No experiences added yet.
              </div>
            ) : (
              <ul className="timeline timeline-vertical">
                {experiences.map((exp, index) => (
                  <motion.li
                    key={exp.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {index > 0 && <hr />}
                    <div className="timeline-start timeline-box">
                      <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                        <Briefcase size={18} />
                        {exp.start_year} - {exp.end_year || 'Present'}
                      </div>
                      <div className="font-bold text-lg">{exp.title}</div>
                      <div className="text-sm text-base-content/70 mb-2">{exp.position}</div>
                      <p className="text-sm">{exp.description}</p>
                    </div>
                    <div className="timeline-middle">
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                    </div>
                    <div className="timeline-end"></div>
                    {index < experiences.length - 1 && <hr />}
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
