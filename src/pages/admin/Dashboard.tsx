import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Briefcase, Code, FolderOpen, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function Dashboard() {
  const [stats, setStats] = useState({
    experiences: 0,
    skills: 0,
    projects: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [expData, skillsData, projectsData, messagesData] = await Promise.all([
      supabase.from('experiences').select('id', { count: 'exact', head: true }),
      supabase.from('skills').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
    ]);

    setStats({
      experiences: expData.count || 0,
      skills: skillsData.count || 0,
      projects: projectsData.count || 0,
      unreadMessages: messagesData.count || 0,
    });
  };

  const cards = [
    {
      title: 'Hero Section',
      icon: Home,
      link: '/admin/hero',
      color: 'bg-blue-500',
    },
    {
      title: 'About Me',
      icon: User,
      link: '/admin/about',
      color: 'bg-green-500',
    },
    {
      title: 'Experiences',
      icon: Briefcase,
      link: '/admin/experiences',
      count: stats.experiences,
      color: 'bg-orange-500',
    },
    {
      title: 'Skills',
      icon: Code,
      link: '/admin/skills',
      count: stats.skills,
      color: 'bg-red-500',
    },
    {
      title: 'Projects',
      icon: FolderOpen,
      link: '/admin/projects',
      count: stats.projects,
      color: 'bg-cyan-500',
    },
    {
      title: 'Messages',
      icon: Mail,
      link: '/admin/messages',
      count: stats.unreadMessages,
      color: 'bg-pink-500',
      badge: stats.unreadMessages > 0,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-base-content/70 mb-8">
        Welcome to your portfolio admin panel. Manage all your content from here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.link}
            to={card.link}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${card.color} text-white`}>
                  <card.icon size={24} />
                </div>
                {card.badge && card.count && card.count > 0 && (
                  <div className="badge badge-primary badge-lg">{card.count}</div>
                )}
              </div>
              <h2 className="card-title mt-4">{card.title}</h2>
              {card.count !== undefined && !card.badge && (
                <p className="text-base-content/70">
                  {card.count} {card.count === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Quick Tips</h2>
          <ul className="list-disc list-inside space-y-2 text-base-content/70">
            <li>Update your Hero section to personalize your portfolio</li>
            <li>Add your CV in the About Me section for visitors to download</li>
            <li>Keep your experiences and skills up to date</li>
            <li>Showcase your best projects with images and links</li>
            <li>Check messages regularly to respond to inquiries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
