import { useEffect, useState } from 'react';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Skill } from '../../types/database';

export function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'technical',
    level: 50,
    order_index: 0,
  });
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('skills')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        setSuccess('Skill updated successfully!');
      } else {
        const { error } = await supabase
          .from('skills')
          .insert([formData]);

        if (error) throw error;
        setSuccess('Skill added successfully!');
      }

      resetForm();
      fetchSkills();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      order_index: skill.order_index,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchSkills();
      setSuccess('Skill deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'technical',
      level: 50,
      order_index: skills.length,
    });
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Skills</h1>

      {success && (
        <div className="alert alert-success mb-6">
          <span>{success}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Skill Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="select select-bordered"
                >
                  <option value="technical">Technical</option>
                  <option value="soft">Soft Skills</option>
                  <option value="design">Design</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Skill Level: {formData.level}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  className="range range-primary"
                  step="5"
                />
                <div className="w-full flex justify-between text-xs px-2">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
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
          <h2 className="text-2xl font-bold mb-4">Existing Skills</h2>
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-xl font-semibold mb-2 capitalize">{category}</h3>
                <div className="space-y-2">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="card bg-base-100 shadow">
                      <div className="card-body p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">{skill.name}</span>
                              <span className="text-sm font-bold text-primary">{skill.level}%</span>
                            </div>
                            <progress
                              className="progress progress-primary w-full"
                              value={skill.level}
                              max="100"
                            ></progress>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="btn btn-xs btn-ghost"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(skill.id)}
                              className="btn btn-xs btn-ghost text-error"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {skills.length === 0 && (
              <div className="text-center text-base-content/50 py-8">
                No skills added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
