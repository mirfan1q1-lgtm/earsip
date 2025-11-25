import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { HeroSection } from '../../types/database';

export function HeroAdmin() {
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;

    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('hero_section')
        .update({
          name: hero.name,
          role: hero.role,
          description: hero.description,
          profile_image_url: hero.profile_image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', hero.id);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating hero:', error);
      alert('Failed to update hero section');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !hero) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setHero({ ...hero, profile_image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  if (!hero) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Hero Section</h1>

      {success && (
        <div className="alert alert-success mb-6">
          <span>Hero section updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={hero.name}
                onChange={(e) => setHero({ ...hero, name: e.target.value })}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Role / Position</span>
              </label>
              <input
                type="text"
                value={hero.role}
                onChange={(e) => setHero({ ...hero, role: e.target.value })}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={hero.description}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                className="textarea textarea-bordered h-24"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Image URL</span>
              </label>
              <input
                type="text"
                value={hero.profile_image_url}
                onChange={(e) => setHero({ ...hero, profile_image_url: e.target.value })}
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

            {hero.profile_image_url && (
              <div className="mt-4">
                <img
                  src={hero.profile_image_url}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
