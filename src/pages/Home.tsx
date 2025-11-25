import { Navbar } from '../components/public/Navbar';
import { Hero } from '../components/public/Hero';
import { About } from '../components/public/About';
import { Experience } from '../components/public/Experience';
import { Skills } from '../components/public/Skills';
import { Projects } from '../components/public/Projects';
import { Contact } from '../components/public/Contact';
import { Footer } from '../components/public/Footer';

export function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
