import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AboutMe } from '../../types/database';

export function AboutAdmin() {
  const [about, setAbout] = useState<AboutMe | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;

    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('about_me')
        .update({
          bio: about.bio,
          cv_url: about.cv_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', about.id);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating about:', error);
      alert('Failed to update about section');
    } finally {
      setLoading(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !about) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    try {
      const fileName = `cv_${Date.now()}.pdf`;
      const filePath = `cv/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setAbout({ ...about, cv_url: publicUrl });
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Failed to upload CV');
    }
  };

  if (!about) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit About Me</h1>

      {success && (
        <div className="alert alert-success mb-6">
          <span>About section updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Biography</span>
              </label>
              <textarea
                value={about.bio}
                onChange={(e) => setAbout({ ...about, bio: e.target.value })}
                className="textarea textarea-bordered h-48"
                placeholder="Write your biography here..."
                required
              />
              <label className="label">
                <span className="label-text-alt">You can use line breaks for formatting</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">CV URL (PDF)</span>
              </label>
              <input
                type="text"
                value={about.cv_url}
                onChange={(e) => setAbout({ ...about, cv_url: e.target.value })}
                className="input input-bordered"
                placeholder="https://example.com/cv.pdf"
              />
              <label className="label">
                <span className="label-text-alt">Or upload a PDF file</span>
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleCVUpload}
                className="file-input file-input-bordered"
              />
            </div>

            {about.cv_url && (
              <div className="alert alert-info">
                <span>CV is uploaded and ready for download</span>
                <a
                  href={about.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-ghost"
                >
                  Preview
                </a>
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
