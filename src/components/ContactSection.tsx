import { useEffect, useRef, useState } from 'react';
import { Mail, Send, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { portfolioApi } from '@/lib/portfolioApi';
import GlitchButton from './GlitchButton';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  customName?: string;
  iconUrl: string;
  brandColor: string;
  order: number;
  isVisible: boolean;
}

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoadingSocial, setIsLoadingSocial] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
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

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setIsLoadingSocial(true);
      const data = await portfolioApi.getVisibleSocialLinks();
      console.log('✅ Social links loaded:', data.length, 'links');
      setSocialLinks(data);
    } catch (error) {
      console.error('❌ Failed to fetch social links:', error);
      setSocialLinks([]);
    } finally {
      setIsLoadingSocial(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate environment variables
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast.error('EmailJS configuration is missing. Please check your environment variables.');
      console.error('Missing EmailJS config:', { serviceId, templateId, publicKey });
      return;
    }

    if (!formRef.current) {
      toast.error('Form reference is missing.');
      return;
    }

    setIsSending(true);

    try {
      // Send email using EmailJS
      const result = await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      console.log('✅ Email sent successfully:', result);

      // Success notification
      toast.success('Message sent successfully! 🚀', {
        description: 'I\'ll get back to you as soon as possible.',
        duration: 5000,
      });

      // Reset form
      setFormData({
        from_name: '',
        from_email: '',
        message: '',
      });

      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error: any) {
      console.error('❌ Failed to send email:', error);
      
      // Error notification with details
      toast.error('Failed to send message', {
        description: error?.text || 'Please try again or contact me directly via email.',
        duration: 7000,
      });
    } finally {
      setIsSending(false);
    }
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

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Social Links - CRT Monitor Style */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="glass-card scan-lines border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 h-full flex flex-col">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--deep-electric-blue)/0.1)]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                <span className="ml-3 font-orbitron text-[10px] text-muted-foreground uppercase tracking-wider opacity-70">
                  social_links.exe
                </span>
              </div>

              {/* Card Content */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-orbitron text-2xl font-bold text-foreground mb-6 text-center">
                  Signal Coordinates
                </h3>

                {isLoadingSocial ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-xs font-orbitron text-muted-foreground">Loading channels...</p>
                    </div>
                  </div>
                ) : socialLinks.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground font-orbitron">No social links available</p>
                  </div>
                ) : (
                  <div className="space-y-3 flex-1">
                    {socialLinks.map((social, index) => (
                      <a
                        key={social._id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] hover:bg-[hsl(var(--deep-electric-blue)/0.2)] transition-all duration-300 group"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          opacity: isVisible ? 1 : 0,
                          animation: isVisible ? `fadeIn 0.5s ease-out ${index * 0.1}s forwards` : 'none'
                        }}
                      >
                        {/* Icon with Brand Color */}
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center border-2 flex-shrink-0 transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: `${social.brandColor}15`,
                            borderColor: `${social.brandColor}40`,
                          }}
                        >
                          <img
                            src={social.iconUrl}
                            alt={social.platform}
                            className="w-7 h-7 object-contain"
                            style={{ filter: `drop-shadow(0 0 8px ${social.brandColor}40)` }}
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(social.platform)}&background=random&size=64`;
                            }}
                          />
                        </div>

                        {/* Platform Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-orbitron text-xs uppercase tracking-wider text-muted-foreground mb-1">
                            {social.customName || social.platform}
                          </p>
                          <p className="text-sm text-foreground group-hover:text-[hsl(var(--neon-cyan))] transition-colors truncate">
                            {social.url.replace(/^https?:\/\/(www\.)?/, '')}
                          </p>
                        </div>

                        {/* External Link Icon */}
                        <ExternalLink className="w-4 h-4 text-[hsl(var(--neon-cyan))] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Status indicator */}
                <div className="mt-6 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)] flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-orbitron text-xs text-green-400 uppercase tracking-wider">
                    Available for new missions
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - CRT Monitor Style */}
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="glass-card scan-lines border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 h-full flex flex-col">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--deep-electric-blue)/0.1)]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                <span className="ml-3 font-orbitron text-[10px] text-muted-foreground uppercase tracking-wider opacity-70">
                  transmission_form.exe
                </span>
              </div>

              {/* Form Content */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-orbitron text-2xl font-bold text-foreground mb-6 text-center">
                  Send Transmission
                </h3>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="from_name" className="block font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                      {'> '}Identifier
                    </label>
                    <input
                      type="text"
                      id="from_name"
                      name="from_name"
                      value={formData.from_name}
                      onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(var(--neon-cyan))] focus:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)] transition-all duration-300"
                      required
                      disabled={isSending}
                      minLength={2}
                      maxLength={100}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="from_email" className="block font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                      {'> '}Communication Frequency
                    </label>
                    <input
                      type="email"
                      id="from_email"
                      name="from_email"
                      value={formData.from_email}
                      onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(var(--neon-cyan))] focus:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)] transition-all duration-300"
                      required
                      disabled={isSending}
                    />
                  </div>

                  {/* Message Field */}
                  <div className="flex-1 flex flex-col">
                    <label htmlFor="message" className="block font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                      {'> '}Transmission Content
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Enter your message..."
                      rows={5}
                      className="w-full flex-1 px-4 py-3 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(var(--neon-cyan))] focus:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)] transition-all duration-300 resize-none"
                      required
                      disabled={isSending}
                      minLength={10}
                      maxLength={2000}
                    />
                  </div>

                  {/* Submit Button */}
                  <GlitchButton 
                    type="submit" 
                    variant="primary" 
                    className="w-full"
                    disabled={isSending}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Transmit Message
                        </>
                      )}
                    </span>
                  </GlitchButton>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className={`mt-16 flex justify-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-neon-cyan" />
            <div className="w-3 h-3 rotate-45 border border-neon-cyan" />
            <div className="w-32 h-px bg-gradient-to-r from-neon-cyan to-neon-magenta" />
            <div className="w-3 h-3 rotate-45 border border-neon-magenta" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-neon-magenta" />
          </div>
        </div>
      </div>

      {/* CSS Animation for fade-in */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default ContactSection;