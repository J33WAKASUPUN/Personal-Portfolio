import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Calendar, Award, MapPin, BookOpen, TrendingUp, ExternalLink } from 'lucide-react';
import { portfolioApi } from '@/lib/portfolioApi';

interface Education {
  _id: string;
  degree: string;
  degreeType: string;
  institution: string;
  institutionLogo: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  classAchieved?: string;
  gpa?: string;
  description: string;
  highlights: string[];
  courses: string[];
  institutionWebsite?: string;
  order: number;
  isVisible: boolean;
}

interface Certification {
  _id: string;
  name: string;
  issuer: string;
  certificateImageUrl: string;
  issueDate: string;
  credentialUrl: string;
  order: number;
  isVisible: boolean;
}

const EducationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true); // Keep as false initially
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('👁️ Education Section in view:', entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Lower threshold from 0.2 to 0.1
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      console.log('✅ IntersectionObserver attached to Education Section');
      
      // Check if already in viewport on mount
      const rect = sectionRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        console.log('🔵 Section already in viewport, setting visible immediately');
        setIsVisible(true);
      }
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchEducationData();
  }, []);

const fetchEducationData = async () => {
  try {
    setIsLoading(true);
    
    let eduData: Education[] = [];
    let certData: Certification[] = [];

    try {
      eduData = await portfolioApi.getVisibleEducation();
      console.log('✅ Education data loaded:', eduData.length, 'records');
      console.log('📊 Education data structure:', eduData); // ✅ ADD THIS
    } catch (eduError) {
      console.error('❌ Failed to fetch education:', eduError);
    }

    try {
      certData = await portfolioApi.getVisibleCertifications();
      console.log('✅ Certifications data loaded:', certData.length, 'records');
      console.log('📊 Certifications data structure:', certData); // ✅ ADD THIS
    } catch (certError) {
      console.error('❌ Failed to fetch certifications:', certError);
    }

    setEducations(eduData);
    setCertifications(certData);
  } catch (error) {
    console.error('❌ Failed to fetch education data:', error);
  } finally {
    setIsLoading(false);
  }
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Duplicate certifications for infinite scroll
  const duplicatedCertifications = certifications.length > 0 
    ? [...certifications, ...certifications, ...certifications] 
    : [];

  if (isLoading) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading academic records...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // After the loading check, before rendering
console.log('🔍 Rendering Education Section:', {
  isLoading,
  educationsCount: educations.length,
  certificationsCount: certifications.length,
  isVisible,
});

  // Don't render if no data
if (educations.length === 0 && certifications.length === 0) {
  console.log('⚠️ Education Section hidden: No data available');
  return null;
}

console.log('✅ Education Section rendering with data');

  return (
    <section
      ref={sectionRef}
      id="education"
      className="relative py-32 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--neon-purple)/0.05)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[hsl(var(--deep-electric-blue)/0.05)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
            {'// Knowledge.initialize()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            Academic Trajectory
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The foundation of my technical expertise. Each degree and certification represents 
            countless hours of learning and mastery.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto mt-6" />
        </div>

        {/* Education Cards - CRT Monitor Style */}
        {educations.length > 0 && (
  <div className="mb-20">
    <div 
      className={`max-w-6xl mx-auto ${
        educations.length === 1 
          ? 'flex justify-center' 
          : 'grid md:grid-cols-2 gap-8'
      }`}
    >
      {educations.map((edu, index) => (
        <div
          key={edu._id}
          className={`glass-card p-8 scan-lines border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 group ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } ${
            educations.length === 1 ? 'max-w-2xl w-full' : ''
          }`}
          style={{ transitionDelay: `${index * 200}ms` }}
        >
                  {/* Terminal Header */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[hsl(var(--deep-electric-blue)/0.3)]">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-4 font-orbitron text-xs text-muted-foreground uppercase tracking-wider">
                      education_record_{index + 1}.exe
                    </span>
                  </div>

                  {/* Institution Logo & Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[hsl(var(--deep-electric-blue)/0.3)] group-hover:border-[hsl(var(--neon-cyan)/0.5)] transition-colors flex-shrink-0 bg-white/5">
                      <img
                        src={edu.institutionLogo}
                        alt={edu.institution}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(edu.institution)}&background=random&size=64`;
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-orbitron text-xl font-bold text-[hsl(var(--neon-cyan))] mb-1 group-hover:text-[hsl(var(--neon-magenta))] transition-colors">
                        {edu.degree}
                      </h3>
                      <p className="text-foreground font-orbitron text-sm mb-2">
                        {edu.institution}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {edu.degreeType}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {edu.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--neon-cyan))] mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="font-orbitron">
                      {formatDate(edu.startDate)} → {edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate || '')}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {edu.description}
                  </p>

                  {/* Academic Achievement */}
                  {(edu.classAchieved || edu.gpa) && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {edu.classAchieved && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--neon-magenta)/0.1)] border border-[hsl(var(--neon-magenta)/0.3)] rounded-full">
                          <TrendingUp className="w-3 h-3 text-[hsl(var(--neon-magenta))]" />
                          <span className="text-xs font-orbitron text-[hsl(var(--neon-magenta))]">
                            {edu.classAchieved}
                          </span>
                        </div>
                      )}
                      {edu.gpa && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] rounded-full">
                          <Award className="w-3 h-3 text-[hsl(var(--neon-cyan))]" />
                          <span className="text-xs font-orbitron text-[hsl(var(--neon-cyan))]">
                            GPA: {edu.gpa}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Highlights */}
                  {edu.highlights.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2 flex items-center gap-2">
                        <Award className="w-3 h-3" />
                        Key Highlights
                      </h4>
                      <ul className="space-y-1">
                        {edu.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                            <span className="text-[hsl(var(--neon-cyan))]">▸</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Courses */}
                  {edu.courses.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-magenta))] mb-2 flex items-center gap-2">
                        <BookOpen className="w-3 h-3" />
                        Key Courses
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {edu.courses.slice(0, 5).map((course, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-1 bg-[hsl(var(--neon-magenta)/0.1)] border border-[hsl(var(--neon-magenta)/0.3)] rounded-full text-[hsl(var(--neon-magenta))] font-orbitron uppercase tracking-wider"
                          >
                            {course}
                          </span>
                        ))}
                        {edu.courses.length > 5 && (
                          <span className="text-[10px] px-2 py-1 text-muted-foreground font-orbitron">
                            +{edu.courses.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Institution Website Link */}
                  {edu.institutionWebsite && (
                    <a
                      href={edu.institutionWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-[hsl(var(--neon-cyan))] hover:text-[hsl(var(--neon-magenta))] transition-colors font-orbitron uppercase tracking-wider"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit Institution
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section - Marquee Style */}
        {certifications.length > 0 && (
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Certifications Header */}
            <div className="text-center mb-12">
              <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-neon-gradient mb-2">
                Professional Certifications
              </h3>
              <p className="text-muted-foreground text-sm">
                Industry-recognized credentials validating my expertise
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] mx-auto mt-4" />
            </div>

            {/* Marquee Container */}
            <div className="relative overflow-hidden">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              {/* Scrolling Certifications */}
              <div className="flex gap-6 marquee">
                {duplicatedCertifications.map((cert, index) => (
                  <div
                    key={`${cert._id}-${index}`}
                    className="flex-shrink-0 w-[320px] glass-card border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 group overflow-hidden"
                  >
                    {/* Certificate Image */}
                    <div className="relative h-40 overflow-hidden bg-[hsl(var(--deep-electric-blue)/0.1)]">
                      <img
                        src={cert.certificateImageUrl}
                        alt={cert.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cert.name)}&background=random&size=400`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                      {/* Verified Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full">
                          <Award className="w-3 h-3 text-green-400" />
                          <span className="text-[10px] font-orbitron text-green-400 uppercase">Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h4 className="font-orbitron text-sm font-bold text-foreground mb-2 line-clamp-2 group-hover:text-[hsl(var(--neon-cyan))] transition-colors min-h-[2.5rem]">
                        {cert.name}
                      </h4>

                      <p className="text-xs text-muted-foreground mb-3 font-orbitron">
                        {cert.issuer}
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-[hsl(var(--neon-magenta))]">
                          <Calendar className="w-3 h-3" />
                          <span className="font-orbitron">
                            {formatDate(cert.issueDate)}
                          </span>
                        </div>

                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-[hsl(var(--neon-cyan))] hover:text-[hsl(var(--neon-magenta))] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="font-orbitron uppercase tracking-wider">Verify</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Decorative Element */}
         <div className={`mt-16 flex justify-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[hsl(var(--neon-cyan))]" />
            <div className="w-3 h-3 rotate-45 border border-[hsl(var(--neon-cyan))]" />
            <div className="w-32 h-px bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))]" />
            <div className="w-3 h-3 rotate-45 border border-[hsl(var(--neon-magenta))]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[hsl(var(--neon-magenta))]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;