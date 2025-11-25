import { useEffect, useState } from 'react';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Experience } from '../../types/database';

export function ExperiencesAdmin() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    position: '',
    start_year: new Date().getFullYear(),
    end_year: null as number | null,
    description: '',
    order_index: 0,
  });
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('experiences')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        setSuccess('Experience updated successfully!');
      } else {
        const { error } = await supabase
          .from('experiences')
          .insert([formData]);

        if (error) throw error;
        setSuccess('Experience added successfully!');
      }

      resetForm();
      fetchExperiences();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience');
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      position: exp.position,
      start_year: exp.start_year,
      end_year: exp.end_year,
      description: exp.description,
      order_index: exp.order_index,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchExperiences();
      setSuccess('Experience deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      position: '',
      start_year: new Date().getFullYear(),
      end_year: null,
      description: '',
      order_index: experiences.length,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Experiences</h1>

      {success && (
        <div className="alert alert-success mb-6">
          <span>{success}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              {editingId ? 'Edit Experience' : 'Add New Experience'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Company / Organization</span>
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
                  <span className="label-text">Position</span>
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Start Year</span>
                  </label>
                  <input
                    type="number"
                    value={formData.start_year}
                    onChange={(e) => setFormData({ ...formData, start_year: parseInt(e.target.value) })}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">End Year</span>
                  </label>
                  <input
                    type="number"
                    value={formData.end_year || ''}
                    onChange={(e) => setFormData({ ...formData, end_year: e.target.value ? parseInt(e.target.value) : null })}
                    className="input input-bordered"
                    placeholder="Present"
                  />
                </div>
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
          <h2 className="text-2xl font-bold mb-4">Existing Experiences</h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg">{exp.title}</h3>
                  <p className="text-sm text-base-content/70">{exp.position}</p>
                  <p className="text-sm">
                    {exp.start_year} - {exp.end_year || 'Present'}
                  </p>
                  <p className="text-sm">{exp.description}</p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="btn btn-sm btn-outline gap-1"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="btn btn-sm btn-error btn-outline gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {experiences.length === 0 && (
              <div className="text-center text-base-content/50 py-8">
                No experiences added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
