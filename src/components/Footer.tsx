import { Github, Linkedin, Twitter, Heart, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/logo.png';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const quickLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#tech' },
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative border-t-2 border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black))] overflow-hidden">
      
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none scan-lines opacity-50" />
      
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-[hsl(var(--deep-electric-blue)/0.05)] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[hsl(var(--neon-magenta)/0.05)] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Column 1: Identity & Bio (Span 5 cols) */}
          <div className="md:col-span-5 space-y-6">
            {/* Logo Section */}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#hero');
              }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              {/* Logo Image */}
              <img 
                src={logo} 
                alt="Logo" 
                className="h-10 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--neon-cyan))]" 
              />
              {/* Brand Name */}
              <span className="font-orbitron text-2xl font-bold text-neon-gradient">
                J33wakaDev
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-mono">
              Full Stack Engineer crafting intelligent solutions with modern web technologies. Building the digital frontier, one pixel at a time.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] text-muted-foreground hover:text-[hsl(var(--neon-cyan))] hover:border-[hsl(var(--neon-cyan))] hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4)] transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (Span 3 cols) */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="font-orbitron text-sm font-bold text-[hsl(var(--neon-magenta))] uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[hsl(var(--neon-cyan))] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[hsl(var(--deep-electric-blue))] group-hover:bg-[hsl(var(--neon-cyan))] transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Get In Touch (Span 4 cols) */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="font-orbitron text-sm font-bold text-[hsl(var(--neon-magenta))] uppercase tracking-wider">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <a 
                href="mailto:jeewaka@example.com" 
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-[hsl(var(--neon-cyan))] transition-colors group"
              >
                <div className="mt-1 p-1.5 rounded bg-[hsl(var(--deep-electric-blue)/0.1)] group-hover:bg-[hsl(var(--neon-cyan)/0.1)] transition-colors">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-foreground mb-0.5">Email</span>
                  supunprabodha789@gmail.com.com
                </div>
              </a>
              
              <div className="flex items-start gap-3 text-sm text-muted-foreground group">
                <div className="mt-1 p-1.5 rounded bg-[hsl(var(--deep-electric-blue)/0.1)] group-hover:bg-[hsl(var(--neon-cyan)/0.1)] transition-colors">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-foreground mb-0.5">Location</span>
                  Kandy, Sri Lanka
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Crafted With */}
        <div className="pt-8 border-t border-[hsl(var(--deep-electric-blue)/0.3)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground opacity-80">
          <p>
            © {currentYear} Jeewaka Supun. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <span className="text-[hsl(var(--neon-cyan))] font-bold">@J33WAKASUPUN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;