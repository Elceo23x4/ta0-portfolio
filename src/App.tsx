import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  HardHat, 
  Ruler, 
  Compass, 
  ClipboardList, 
  BookOpen,
  Store,
  Send,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Preloader Component
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E0F12] transition-opacity duration-500">
      <div className="text-white font-script text-6xl font-bold animate-pulse">
        TAA PORTFOLIO
      </div>
    </div>
  );
}

// Custom Cursor Component
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) return;
    
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null;

  return (
    <div 
      ref={cursorRef}
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
      style={{ left: 0, top: 0, position: 'fixed', pointerEvents: 'none', zIndex: 9999 }}
    >
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <path d="M8 4L8 24L12 20L16 28L20 26L16 18L22 18L8 4Z" fill="#D4A574" stroke="#8B6914" strokeWidth="1"/>
        <circle cx="8" cy="4" r="2" fill="#D13B3B" />
      </svg>
    </div>
  );
}

// Floating Construction Character
function FloatingCharacter() {
  return (
    <div 
      className="fixed left-4 top-1/3 z-40 hidden lg:block"
      style={{ width: '100px', animation: 'bob 3s ease-in-out infinite' }}
    >
      <img 
        src="/images/construction-character.png" 
        alt="TAA"
        className="w-full h-auto drop-shadow-lg"
      />
    </div>
  );
}

// Floating Background Tools
function FloatingTools() {
  const tools = [
    { Icon: Compass, x: '8%', y: '15%', delay: 0 },
    { Icon: Ruler, x: '85%', y: '20%', delay: 1 },
    { Icon: HardHat, x: '75%', y: '65%', delay: 2 },
    { Icon: ClipboardList, x: '12%', y: '70%', delay: 0.5 },
    { Icon: BookOpen, x: '5%', y: '45%', delay: 2.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {tools.map(({ Icon, x, y, delay }, i) => (
        <div
          key={i}
          className="absolute"
          style={{ 
            left: x, 
            top: y, 
            animation: `drift 8s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            opacity: 0.15
          }}
        >
          <Icon size={40} strokeWidth={1} className="text-[#111216]" />
        </div>
      ))}
    </div>
  );
}

// Back to Top Button
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#D13B3B] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <HardHat className="w-6 h-6 text-white" />
    </button>
  );
}

// Floating Bookstore Icon
function BookstoreIcon() {
  const handleClick = () => {
    window.open('https://a.co/d/015cpGWf', '_blank');
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      <div 
        onClick={handleClick}
        className="w-14 h-14 bg-[#D13B3B] rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
      >
        <Store className="w-7 h-7 text-white" />
      </div>
      <span className="mt-2 text-xs font-mono uppercase tracking-wider text-[#6E6F74] bg-white/80 px-2 py-1 rounded">
        buy now
      </span>
    </div>
  );
}

// Hero Section
function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll('.word');
      
      if (words && words.length > 0) {
        gsap.set(words, { opacity: 1, y: 0, rotation: 0 });
        
        gsap.from(words, {
          opacity: 0,
          y: 30,
          rotation: -3,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.5
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const bookTitles = [
    'Property Valuation | Theory and Practice',
    'Valuation of Non-Landed Property Assets ',
    'Valuation of Tangible and Intangible Assets',
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen paper-texture flex flex-col items-center justify-center py-10"
    >
      <h1 
        ref={headlineRef} className="text-hero font-mono text-center px-4 z-10 mb-8">
        <span className="word inline-block">Valuation</span>{' '}
        <span className="word inline-block">is</span>{' '}
        <span className="word inline-block">not</span>{' '}
        <span className="word inline-block">a</span>{' '}
        <span className="word inline-block">task,</span>{' '}
        <span className="word inline-block">it&apos;s</span>{' '}
        <span className="word inline-block">a</span>{' '}
        <span className="word inline-block text-[#D13B3B]">product of</span>
        <span className="word inline-block">acquired expertise</span>
      </h1>

      <p className="text-sm font-mono text-[#6E6F74] uppercase tracking-wider mb-12">
        Assets and Property valuation Services • Mentoring and Trainings 
      </p>

      <div className="w-full overflow-hidden py-6 bg-white/80 shadow-md -rotate-1">
        <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
          {[...bookTitles, ...bookTitles, ...bookTitles].map((title, i) => (
            <div key={i} className="flex items-center gap-4 px-4">
              <BookOpen className="w-5 h-5 text-[#6E6F74]" />
              <span className="font-script text-xl text-[#111216]">{title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-[15vh] right-[12vw] w-[100px] h-[100px] stamp flex items-center justify-center">
        <div className="text-[#D13B3B] font-script text-3xl font-bold rotate-[-5deg]">
          TAA
        </div>
      </div>
    </section>
  );
}

// Paper Plane Transition Section
function PaperPlaneSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const planeRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(planeRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1
        },
        x: '-30vw',
        opacity: 0,
        scale: 0.7
      });

      gsap.to(planeRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 20%',
          end: 'bottom top',
          scrub: 1
        },
        x: '30vw',
        opacity: 0,
        scale: 1.1
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-[20vh] bg-white overflow-hidden flex items-center justify-center"
    >
      <img 
        ref={planeRef}
        src="/images/paper-plane.png" 
        alt="Paper Plane"
        className="relative z-10 w-[25vw] max-w-[300px] h-auto"
      />
    </section>
  );
}

// Achievements Section
function AchievementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollElement = scrollRef.current;
      const sectionElement = sectionRef.current;
      
      if (!scrollElement || !sectionElement) return;

      gsap.from(scrollElement, {
        scrollTrigger: {
          trigger: sectionElement,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1
        },
        scaleX: 0.1,
        opacity: 0
      });

      const achievementItems = sectionElement.querySelectorAll('.achievement-item');
      
      if (achievementItems.length > 0) {
        gsap.from(achievementItems, {
          scrollTrigger: {
            trigger: sectionElement,
            start: 'top 60%',
            end: 'top 20%',
            scrub: 1
          },
          x: -30,
          opacity: 0,
          stagger: 0.1
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const achievements = [
    'First Class and top-notch degrees in Valuation up to PhD',
    'Several awards and recognition for excellent performance',
    'Author of 3 best-selling books on Property Valuation',
    'Certified Intellectual Property Valuer',
    'Nearly 4 decades as a registered Estate Surveyor and Valuer',
    'Lecturing on valuation for Over 30+ years across tertiary institutions',
    'Mentor and consultant to various field practitioners'
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen paper-texture flex flex-col items-center justify-center py-20"
    >
      <h2 className="text-section font-script text-[#111216] mb-12">
        Highlights
      </h2>

      <div 
        ref={scrollRef}
        className="relative w-[90vw] max-w-[900px]"
        style={{ transformOrigin: 'center' }}
      >
        <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-[20px] h-[300px] bg-gradient-to-r from-amber-700 to-amber-600 rounded-full shadow-lg z-10" />
        
        <div 
          className="w-full rounded-lg overflow-hidden shadow-2xl p-8 lg:p-12"
          style={{
            backgroundImage: 'url(/images/scroll-parchment.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <ul className="space-y-5">
            {achievements.map((achievement, i) => (
              <li key={i} className="achievement-item flex items-start gap-4">
                <HardHat className="w-5 h-5 text-[#D13B3B] mt-1 flex-shrink-0" />
                <span className="text-lg text-[#111216]">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[20px] h-[300px] bg-gradient-to-l from-amber-700 to-amber-600 rounded-full shadow-lg z-10" />
      </div>

      <div className="absolute top-[15vh] right-[15vw] stamp w-[70px] h-[70px] flex items-center justify-center">
        <span className="text-[#D13B3B] font-script text-lg font-bold rotate-[-8deg]">TAA</span>
      </div>

      <a 
        href="#journey" 
        className="mt-10 text-[#D13B3B] font-mono text-sm uppercase tracking-wider flex items-center gap-2 hover:underline"
      >
        Read the story <ArrowRight className="w-4 h-4" />
      </a>
    </section>
  );
}

// Journey Section
function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.journey-content', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1
        },
        x: 50,
        opacity: 0
      });

      gsap.from('.journey-image', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1
        },
        x: -50,
        opacity: 0
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="journey"
      className="relative w-full min-h-screen paper-texture py-20"
    >
      <div className="container mx-auto px-4">
        <div 
          className="relative mx-auto max-w-[1000px] bg-white shadow-xl rounded-sm p-8 lg:p-12"
          style={{ 
            transform: 'rotate(-1deg)',
          }}
        >
          <div 
            className="absolute inset-0 opacity-10 rounded-sm"
            style={{
              backgroundImage: 'url(/images/blueprint-paper.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          <h2 className="text-section font-script text-[#111216] mb-8 relative z-10">The Journey</h2>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
            <div 
              className="journey-image relative flex-shrink-0 mx-auto lg:mx-0"
              onMouseEnter={() => setShowQuote(true)}
              onMouseLeave={() => setShowQuote(false)}
            >
              <div className="relative w-[200px] h-[200px] lg:w-[250px] lg:h-[250px] rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="/images/creator-portrait.jpg" 
                  alt="T.A. Ashaolu"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className={`absolute -bottom-2 -right-2 bg-white p-3 rounded-lg shadow-lg max-w-[180px] transition-all duration-300 ${showQuote ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <p className="font-script text-lg text-[#111216]">&ldquo;Every property tells a story.&rdquo;</p>
              </div>
            </div>

            <div className="journey-content flex-1">
              <p className="text-lg text-[#111216] leading-relaxed mb-6">
                I started practising as a trainee with foremost Nigerian estate valuation firm - Harriman and Company - in 1986, I became a professional Estate Surveyor and Valuer in 1989.
                I have had many remarkable field experiences in property and assets (tangible and intangible) valuation. On academic front, I started as a lecturer at Obafemi Awolowo University, Ile-Ife and also was a former Head of Department of Estate management and Valuation, in Federal Polytechnic, Ilaro. 
              </p>
              <p className="text-lg text-[#111216] leading-relaxed mb-8">
                My books on Valuation were written out of my daring passion for knowledge sharing. They combine 
                technical precision with practical experience and wisdom gained from years of hands-on experience.
              </p>
              <p className="font-script text-2xl text-[#D13B3B]">— T.A. Ashaolu</p>
            </div>
             {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a 
            href="https://orcid.org/0000-0003-4906-4550"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#D13B3B] text-white rounded-full font-mono text-sm uppercase tracking-wider transition-all hover:bg-[#b53232] hover:shadow-[0_4px_20px_rgba(209,59,59,0.4)]"
          >
            More About Me <ArrowRight className="w-4 h-4" />
          </a>
        </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Books Section
function BooksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);

  const books = [
    {
      title:  'Valuation of Tangible and Intangible Assets',
      description: 'A daring compedium and trailblazing effort embracing modalities for valuing all categories of assets. It familiarises the valuer with both basic valuation tools and a clear understanding of each of the underlying subjects of valuation',
      image: '/images/book-cover-1.jpg'
    },
    {
      title: 'Property Valuation | Theory and Practice',
      description: 'Simplified property valuation mathematics and methodologies covering all regular undergraduate and some graduate curricula.',
      image: '/images/book-cover-2.jpg'
    },
    {
      title: 'Valuation of Non-Landed Property Assets ',
      description: 'First of its kind textbook on knowledge sets and procedures for ascertaining the worth of non-real estate assets.',
      image: '/images/book-cover-3.jpg'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.book-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        },
        y: 80,
        opacity: 0.5,
        stagger: 0.1
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="books"
      className="relative w-full min-h-screen paper-texture py-20"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-section font-script text-center text-[#111216] mb-16">
          My Books
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-12">
          {books.map((book, i) => (
            <div
              key={i}
              className="book-item relative cursor-pointer"
              style={{
                transform: `rotate(${i === 0 ? '-3' : i === 2 ? '3' : '0'}deg)`,
                zIndex: hoveredBook === i ? 10 : 3 - i
              }}
              onMouseEnter={() => setHoveredBook(i)}
              onMouseLeave={() => setHoveredBook(null)}
            >
              <div 
                className="w-[200px] lg:w-[240px] shadow-xl rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03]"
              >
                <img 
                  src={book.image} 
                  alt={book.title}
                  className="w-full h-auto block"
                />
              </div>
              
              <p className="text-center font-script text-lg text-[#111216] mt-4">
                {book.title}
              </p>
              
              <div 
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[260px] bg-white p-4 rounded-lg shadow-xl transition-all duration-300 z-20 ${
                  hoveredBook === i ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <p className="text-sm text-[#6E6F74]">{book.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <a 
            href="#flipbook"
            className="inline-flex items-center gap-2 text-[#D13B3B] font-mono text-sm uppercase tracking-wider hover:underline"
          >
            Browse the bookstore <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="absolute top-[15vh] right-[10vw] stamp w-[70px] h-[70px] flex items-center justify-center">
        <span className="text-[#D13B3B] font-script text-lg font-bold rotate-[5deg]">TAA</span>
      </div>
    </section>
  );
}

// Flip-Book Section
function FlipBookSection() {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    { title: 'Table of Contents', content: ['Introduction', 'Valuation of Tangible Assets', 'Intangible Assets', 'Valuation of Business', 'Concluding Remarks'] },
    { title: '1. Introduction', content: ['General Introduction', 'Background to Asset Valuation- The Nigerian Example'] },
    { title: '2. Valuation of Tangible Assets', content: ['Valuation of Furniture, Fixtures and Fittings', 'Valuation of Plant and Machinery I: Knowledge of Contents', 'Valuation of Plant and Machinery II: Procedures', 'Valuation of Vehicles', 'Valuation of Infrastructure Assets'] },
    { title: '3. Valuation of Tangible Assets', content: ['Valuation of Mineral Assets', 'Valuation of Real Estate', 'Valuation of Environmental Sustainability and ESG Factor', 'Valuation of Jewelry, Antique Etc', 'Valuation of Construction Works', 'Valuation of Rural/Agricultural Products'] },
    { title: '4. Intangible Assets', content: ['Valuation of Intagible Assets I: Goodwill', 'Valuation of Intagible II: Forms of Intellectual Property', 'Valuation of Intagible III: Intellectual Property', 'Valuation of Intellectual Capital', 'Valuation of Digital Assets'] },
    { title: '5. Valuation of Business', content: ['Valuation of Business', 'Valuation of Shares'] },
    { title: '6. Concluding Remarks', content: ['Market Survey', 'Depreciation', 'Issues Surrounding Asset Valuation'] }
  ];        

  const nextPage = () => {
    if (currentPage < Math.floor((pages.length - 1) / 2)) {
      setCurrentPage(p => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
    }
  };

  const leftPageIndex = currentPage * 2;
  const rightPageIndex = currentPage * 2 + 1;

  return (
    <section 
      id="flipbook"
      className="relative w-full min-h-screen paper-texture flex flex-col items-center justify-center py-20"
    >
      <div className="relative w-[95vw] sm:w-[90vw] max-w-[700px] min-h-[60vh] sm:min-h-[50vh] lg:min-h-[55vh]">
        <div className="relative w-full h-full flex">
          <div className="w-1/2 min-h-full bg-white shadow-lg rounded-l-sm p-3 sm:p-4 lg:p-6 xl:p-8 border-r border-[#e0e0e0] flex flex-col">
            <h3 className="font-script text-lg sm:text-xl lg:text-2xl text-[#111216] mb-3 sm:mb-4 lg:mb-6 break-words">
              {pages[leftPageIndex]?.title}
            </h3>
            
            <ul className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
              {pages[leftPageIndex]?.content.map((item, i) => (
                <li key={i} className="flex items-start gap-2 sm:gap-3 text-[#6E6F74] text-xs sm:text-sm break-words">
                  <span className="w-1.5 h-1.5 bg-[#D13B3B] rounded-full flex-shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-auto pt-3 font-mono text-[10px] sm:text-xs text-[#6E6F74]">
              Page {leftPageIndex + 1}
            </div>
          </div>

          <div className="w-1/2 min-h-full bg-white shadow-lg rounded-r-sm p-3 sm:p-4 lg:p-6 xl:p-8 relative flex flex-col">
            {rightPageIndex < pages.length ? (
              <>
                <h3 className="font-script text-lg sm:text-xl lg:text-2xl text-[#111216] mb-3 sm:mb-4 lg:mb-6 break-words">
                  {pages[rightPageIndex]?.title}
                </h3>
                
                <ul className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
                  {pages[rightPageIndex]?.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3 text-[#6E6F74] text-xs sm:text-sm break-words">
                      <span className="w-1.5 h-1.5 bg-[#D13B3B] rounded-full flex-shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="w-10 h-10 sm:w-14 sm:h-14 text-[#D13B3B] mx-auto mb-4" />
                  <p className="font-script text-lg sm:text-xl text-[#6E6F74]">End of Contents</p>
                </div>
              </div>
            )}
            
            <div className="mt-auto pt-3 text-right font-mono text-[10px] sm:text-xs text-[#6E6F74]">
              Page {rightPageIndex + 1}
            </div>
          </div>

          <div className="absolute left-1/2 top-0 w-2 sm:w-3 h-full -translate-x-1/2 bg-gradient-to-r from-[#d0d0d0] via-[#f0f0f0] to-[#d0d0d0] shadow-inner" />
        </div>
      </div>

      <div className="flex items-center gap-6 mt-10">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#111216] rounded-full text-[#111216] font-mono text-sm uppercase tracking-wider transition-all hover:bg-[#111216] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage >= Math.floor((pages.length - 1) / 2)}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#111216] rounded-full text-[#111216] font-mono text-sm uppercase tracking-wider transition-all hover:bg-[#111216] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}



// Reviews Section
function ReviewsSection() {
  const reviews = [
    {
      text: "Our backlist includes numerous real estate valuation books but not something this broad.",
      name: "Ed Needle, Taylor & Francis Group",
      location: "Oxfordshire, United Kingdom",
      role: "Publishers"
    },
    {
      text: "The book is novel in coverage and depth, penetrating areas that had not been captured by previous authors in property valuation.",
      name: "Prof. O.M. Bello",
      location: "Akure, Nigeria",
      role: "Academic"
    },
    {
      text: "The book is both holistic and forward-looking. The author did an excellent job of explaining difficult concepts concisely, clearly and accurately.",
      name: "Prof. G.K. Babawale",
      location: "Lagos,   Nigeria",
      role: "Academic"
    }
  ];

  return (
    <section 
      id="reviews"
      className="relative w-full min-h-screen py-15 overflow-hidden bg-[#0E0F12]"
    >
      {/* Video Background - Desktop Only */}
      <div className="absolute inset-0 hidden lg:block">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
          poster="/images/reviews-poster.jpg"
        >
          <source src="/videos/thumbs-up-book.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support mp4 */}
          <source src="/videos/thumbs-up-book.webm" type="video/webm" />
        </video>
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E0F12]/80 via-[#0E0F12]/60 to-[#0E0F12]/80" />
      </div>

      {/* Mobile Fallback Background */}
      <div 
        className="absolute inset-0 lg:hidden"
        style={{
          backgroundImage: 'url(/images/paper-texture.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1
        }}
      />
      <div className="absolute inset-0 lg:hidden bg-[#0E0F12]/95" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-section font-script text-center text-white mb-4">
          Book Reviews
        </h2>
        <p className="text-center text-[#6E6F74] font-mono text-sm uppercase tracking-wider mb-16">
          Testimonials from professionals across the field
        </p>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1200px] mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                transform: 'skewX(-8deg)',
              }}
            >
              {/* Parallelogram Tile */}
              <div 
                className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-6 lg:p-8 h-full transition-all duration-300 hover:bg-white/10 hover:border-[#D13B3B]/30 hover:shadow-[0_8px_32px_rgba(209,59,59,0.15)] hover:-translate-y-2"
                style={{
                  transform: 'skewX(0deg)', // Counter-skew content
                }}
              >
                {/* Quote Icon */}
                <div className="absolute -top-3 -left-2 w-8 h-8 bg-[#D13B3B] rounded-full flex items-center justify-center shadow-lg">
                  <svg 
                    className="w-4 h-4 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Review Text */}
                <p className="text-[#e0e0e0] text-sm lg:text-base leading-relaxed mb-6 mt-2 italic">
                  "{review.text}"
                </p>

                {/* Reviewer Info */}
                <div className="border-t border-white/10 pt-4">
                  <p className="font-Arial text-lg text-[#D13B3B]">
                    {review.name}
                  </p>
                  <p className="text-[#6E6F74] text-xs font-mono uppercase tracking-wider">
                    {review.role}
                  </p>
                  <p className="text-[#6E6F74]/70 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {review.location}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#D13B3B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

       
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-[#D13B3B]/20 rotate-45 hidden lg:block" />
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-[#D13B3B]/20 rotate-12 hidden lg:block" />
    </section>
  );
}





// Bookstore CTA Section
function BookstoreSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bookstore-circle', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1
        },
        scale: 0.7,
        opacity: 0
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen paper-texture flex items-center justify-center py-20"
    >
      <div className="bookstore-circle w-[70vw] h-[70vw] max-w-[450px] max-h-[450px] bg-[#D13B3B] rounded-full flex flex-col items-center justify-center text-center p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
        <h2 className="text-4xl lg:text-5xl font-script text-white mb-4">
          Get the latest book
        </h2>
        <p className="text-white/90 text-sm lg:text-base max-w-[260px] mb-8">
          Valuation of Tangible and Intangible Assets
        </p>
        <a 
          href="https://selar.co/bookstore"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 bg-white text-[#D13B3B] rounded-full font-mono text-sm uppercase tracking-wider transition-all hover:shadow-lg"
        >
          Visit Bookstore
        </a>
        <a 
          href="#"
          className="mt-4 text-white/70 text-sm hover:text-white transition-colors underline"
        >
          Download sample chapter (PDF)
        </a>
      </div>

      <div className="absolute top-[15%] left-[15%] opacity-20">
        <Compass className="w-10 h-10 text-[#111216]" />
      </div>
      <div className="absolute bottom-[20%] right-[15%] opacity-20">
        <Ruler className="w-10 h-10 text-[#111216]" />
      </div>
    </section>
  );
}

// Contact Section - UPDATED WITH WHATSAPP INTEGRATION
function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    const phoneNumber = '2348023220961';
    
    // Format the message
    const text = `*New Message From TAA Web*%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A*Message:* ${encodeURIComponent(formData.message)}`;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${text}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success state
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section 
      id="contact"
      className="relative w-full min-h-screen bg-[#0E0F12] flex items-center justify-center py-20"
    >
      <div className="container mx-auto px-4">
        <div className="relative max-w-[650px] mx-auto">
          <div 
            className="relative rounded-lg shadow-2xl overflow-hidden"
            style={{
              backgroundImage: 'url(/images/envelope.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="p-8 lg:p-12 bg-white/95">
              <h2 className="text-section font-script text-[#111216] mb-8 text-center">
                Let&apos;s Value Your Assets.
              </h2>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* WhatsApp Contact Form */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#6E6F74] mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#ddd] rounded focus:outline-none focus:border-[#D13B3B] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#6E6F74] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#ddd] rounded focus:outline-none focus:border-[#D13B3B] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#6E6F74] mb-1">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-[#ddd] rounded focus:outline-none focus:border-[#D13B3B] transition-colors resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-[#D13B3B] text-white rounded font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#b53232] transition-colors"
                  >
                    {submitted ? 'Opening WhatsApp...' : <><Send className="w-4 h-4" /> Send via WhatsApp</>}
                  </button>
                </form>

                {/* Contact Info */}
                <div className="lg:w-[180px] space-y-5">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[#6E6F74] mb-1">
                      Email
                    </h4>
                    <a href="mailto:taashaolu@yahoo.com" className="flex items-center gap-2 text-[#111216] hover:text-[#D13B3B] transition-colors text-sm">
                      <Mail className="w-4 h-4" />
                      taashaolu@yahoo.com
                    </a>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[#6E6F74] mb-1">
                      Location
                    </h4>
                    <p className="flex items-center gap-2 text-[#111216] text-sm">
                      <MapPin className="w-4 h-4" />
                      17, Ahmed Onibudo St, Victoria Island, Lagos, Nigeria
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[#6E6F74] mb-1">
                      Phone
                    </h4>
                    <p className="flex items-center gap-2 text-[#111216] text-sm">
                      <Phone className="w-4 h-4" />
                      +234 8023220961
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[#6E6F74] mb-1">
                      Social
                    </h4>
                    <div className="flex gap-3">
                      <a href="https://linkedin.com/in/thomas-ashaolu-756a9764" className="text-[#111216] hover:text-[#D13B3B] transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a href="#" className="text-[#111216] hover:text-[#D13B3B] transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer Section
function FooterSection() {
  return (
    <footer className="w-full bg-[#0E0F12] py-10 px-4">
      <div className="container mx-auto text-center">
        <div className="font-script text-3xl text-white mb-3">TAA</div>
        <p className="text-[#6E6F74] text-sm mb-4">
          © 2026 TAA Portfolio. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-5">
          <a href="#contact" className="text-[#6E6F74] hover:text-white text-sm transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      ScrollTrigger.refresh();
    }
  }, [isLoading]);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {!isLoading && <CustomCursor />}

      {!isLoading && <FloatingCharacter />}

      {!isLoading && <FloatingTools />}

      {!isLoading && <BackToTop />}

      {!isLoading && <BookstoreIcon />}

      <main className="relative">
        <HeroSection />
        <PaperPlaneSection />
        <AchievementsSection />
        <JourneySection />
        <BooksSection />
        <FlipBookSection />
        <ReviewsSection />
        <BookstoreSection />
        <ContactSection />
        <FooterSection />
      </main>
    </>
  );
}

export default App;