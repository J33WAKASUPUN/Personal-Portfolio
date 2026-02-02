import { Github, Linkedin, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <footer className="relative py-12 border-t border-neon-cyan/10">
      {/* Background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-neon-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#hero" className="font-orbitron text-xl font-bold text-neon-gradient">
            {'<DEV/>'}
          </a>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="p-2 rounded-lg border border-neon-cyan/20 text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/50 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear}</span>
            <span className="text-neon-cyan">|</span>
            <span>Crafted with</span>
            <Heart size={14} className="text-neon-magenta fill-neon-magenta" />
            <span>by John Doe</span>
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-neon-cyan/50" />
            <div className="w-1 h-1 rounded-full bg-neon-cyan/50" />
            <div className="w-16 h-px bg-neon-cyan/30" />
            <div className="w-1 h-1 rounded-full bg-neon-magenta/50" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-neon-magenta/50" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
