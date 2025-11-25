import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Skill } from '../../types/database';

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });

    if (data) {
      setSkills(data);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="min-h-screen flex items-center justify-center py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
            Skills
          </h2>

          <div className="max-w-5xl mx-auto">
            {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: catIndex * 0.1 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h3 className="text-2xl font-bold mb-6 capitalize">{category}</h3>
                <div className="grid gap-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="card bg-base-100 shadow-lg">
                      <div className="card-body p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{skill.name}</span>
                          <span className="text-sm text-primary font-bold">{skill.level}%</span>
                        </div>
                        <progress
                          className="progress progress-primary"
                          value={skill.level}
                          max="100"
                        ></progress>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {skills.length === 0 && (
              <div className="text-center text-base-content/50">
                No skills added yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
