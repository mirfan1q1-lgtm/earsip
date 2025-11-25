import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Project } from '../../types/database';

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    technologies: [] as string[],
    year: new Date().getFullYear(),
    demo_link: '',
    github_link: '',
    order_index: 0,
  });
  const [techInput, setTechInput] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const projectData = {
        ...formData,
        demo_link: formData.demo_link || null,
        github_link: formData.github_link || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...projectData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        setSuccess('Project updated successfully!');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        setSuccess('Project added successfully!');
      }

      resetForm();
      fetchProjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      technologies: project.technologies,
      year: project.year,
      demo_link: project.demo_link || '',
      github_link: project.github_link || '',
      order_index: project.order_index,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchProjects();
      setSuccess('Project deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      technologies: [],
      year: new Date().getFullYear(),
      demo_link: '',
      github_link: '',
      order_index: projects.length,
    });
    setTechInput('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

      {success && (
        <div className="alert alert-success mb-6">
          <span>{success}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Project Title</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea textarea-bordered h-24"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Image URL</span>
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="input input-bordered"
                  placeholder="https://example.com/image.jpg"
                />
                <label className="label">
                  <span className="label-text-alt">Or upload an image</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered"
                />
              </div>

              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Technologies</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    className="input input-bordered flex-1"
                    placeholder="Add technology"
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="btn btn-outline"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech, i) => (
                    <div key={i} className="badge badge-primary gap-2">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="btn btn-ghost btn-xs btn-circle"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Year</span>
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Demo Link (optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.demo_link}
                  onChange={(e) => setFormData({ ...formData, demo_link: e.target.value })}
                  className="input input-bordered"
                  placeholder="https://demo.example.com"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">GitHub Link (optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.github_link}
                  onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                  className="input input-bordered"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Display Order</span>
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="input input-bordered"
                  min="0"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary gap-2 flex-1">
                  <Save size={20} />
                  {editingId ? 'Update' : 'Add'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="btn btn-ghost gap-2">
                    <X size={20} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Existing Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="card bg-base-100 shadow-xl">
                <figure className="h-32 bg-base-200">
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-lg">
                    {project.title}
                    <div className="badge badge-secondary">{project.year}</div>
                  </h3>
                  <p className="text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-1 my-2">
                    {project.technologies.map((tech, i) => (
                      <div key={i} className="badge badge-outline badge-sm">
                        {tech}
                      </div>
                    ))}
                  </div>
                  <div className="card-actions justify-end">
                    <button
                      onClick={() => handleEdit(project)}
                      className="btn btn-sm btn-outline gap-1"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="btn btn-sm btn-error btn-outline gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="text-center text-base-content/50 py-8">
                No projects added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
