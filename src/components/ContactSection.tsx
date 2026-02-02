import { useEffect, useRef, useState } from 'react';
import { Mail, Send, Satellite } from 'lucide-react';
import GlitchButton from './GlitchButton';

// Social platform icons
const GithubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MediumIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);

const UpworkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#6FDA44">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
  </svg>
);

const socialLinks = [
  {
    name: 'Email',
    icon: Mail,
    href: 'mailto:jeewaka@example.com',
    label: 'jeewaka@example.com',
    color: 'hsl(var(--neon-cyan))',
  },
  {
    name: 'GitHub',
    icon: GithubIcon,
    href: 'https://github.com/jeewakasupun',
    label: 'github.com/jeewakasupun',
    color: 'currentColor',
  },
  {
    name: 'Medium',
    icon: MediumIcon,
    href: 'https://medium.com/@jeewakasupun',
    label: 'medium.com/@jeewakasupun',
    color: 'currentColor',
  },
  {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    href: 'https://linkedin.com/in/jeewakasupun',
    label: 'linkedin.com/in/jeewakasupun',
    color: '#0A66C2',
  },
  {
    name: 'Upwork',
    icon: UpworkIcon,
    href: 'https://upwork.com/freelancers/jeewakasupun',
    label: 'upwork.com/~jeewakasupun',
    color: '#6FDA44',
  },
];

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[hsl(var(--deep-electric-blue)/0.1)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
            {'// Contact.establish()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            Open Channel
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to embark on a new mission together? Send a transmission and let's create 
            something extraordinary.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="glass-card p-8 h-full">
              {/* Satellite Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(var(--deep-electric-blue)/0.3)] to-[hsl(var(--neon-magenta)/0.2)] flex items-center justify-center">
                    <Satellite className="w-12 h-12 text-[hsl(var(--neon-cyan))]" />
                  </div>
                  <div className="absolute -inset-2 rounded-full border border-[hsl(var(--deep-electric-blue)/0.5)] animate-spin" style={{ animationDuration: '15s' }} />
                  <div className="absolute -inset-4 rounded-full border border-[hsl(var(--neon-magenta)/0.3)] animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
                </div>
              </div>

              <h3 className="font-orbitron text-2xl text-center text-foreground mb-8">
                Signal Coordinates
              </h3>

              <div className="space-y-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  const isLucideIcon = social.name === 'Email';
                  
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target={social.name !== 'Email' ? '_blank' : undefined}
                      rel={social.name !== 'Email' ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] hover:bg-[hsl(var(--deep-electric-blue)/0.2)] transition-all duration-300 group"
                      style={{ 
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="p-3 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.2)] group-hover:bg-[hsl(var(--neon-cyan)/0.1)] transition-colors">
                        {isLucideIcon ? (
                          <Icon className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
                        ) : (
                          <Icon />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-orbitron text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          {social.name}
                        </p>
                        <p className="text-foreground group-hover:text-[hsl(var(--neon-cyan))] transition-colors truncate">
                          {social.label}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Status indicator */}
              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-orbitron text-xs text-green-400 uppercase tracking-wider">
                  Available for new missions
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="glass-card p-8 scan-lines">
              {/* Form Header */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[hsl(var(--deep-electric-blue)/0.3)]">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 font-orbitron text-sm text-muted-foreground">
                  transmission_form.exe
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                    {'> '}Identifier
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(var(--neon-cyan))] focus:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)] transition-all duration-300"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                    {'> '}Communication Frequency
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(var(--neon-cyan))] focus:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)] transition-all duration-300"
                    required
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                    {'> '}Transmission Content
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter your message..."
                    rows={5}
                    className="w-full px-4 py-3 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(var(--neon-cyan))] focus:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)] transition-all duration-300 resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <GlitchButton type="submit" variant="primary" className="w-full">
                  <span className="flex items-center justify-center gap-2">
                    <Send size={18} />
                    Transmit Message
                  </span>
                </GlitchButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
