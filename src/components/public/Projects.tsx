import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Project } from '../../types/database';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (data) {
      setProjects(data);
    }
  };

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
            Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <figure className="h-48 bg-base-200 flex items-center justify-center">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={60} className="text-base-content/30" />
                  )}
                </figure>
                <div className="card-body">
                  <h3 className="card-title">
                    {project.title}
                    <div className="badge badge-secondary">{project.year}</div>
                  </h3>
                  <p className="text-sm">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, i) => (
                      <div key={i} className="badge badge-outline badge-sm">
                        {tech}
                      </div>
                    ))}
                  </div>

                  <div className="card-actions justify-end mt-4">
                    {project.demo_link && (
                      <a
                        href={project.demo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary gap-1"
                      >
                        <ExternalLink size={16} />
                        Demo
                      </a>
                    )}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline gap-1"
                      >
                        <Github size={16} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center text-base-content/50">
              No projects added yet.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
