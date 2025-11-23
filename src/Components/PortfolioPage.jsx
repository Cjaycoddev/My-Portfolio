import React, { useEffect, useState } from "react";
import "../index.css";
import FloatingAssistant from './PortfolioChatbot';

export default function PortfolioPage() {
  // 🧠 Responsive Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 🧠 Image zoom state + handlers
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState(""); // ✅ For Formspree messages

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  // --- EFFECTS (KEEPING ALL YOUR ORIGINAL EFFECTS INTACT) ---

  useEffect(() => {
    // 🔊 Play swoosh sound when title appears
    const playSwoosh = () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    };

    const timer = setTimeout(playSwoosh, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 🌀 Parallax mouse movement effect for stars
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const moveX = (e.clientX / innerWidth - 0.5) * 50;
      const moveY = (e.clientY / innerHeight - 0.5) * 50;
  
      document.querySelectorAll(".stars, .stars2, .stars3").forEach((layer, index) => {
        const depth = (index + 1) * 10;
        layer.style.transform = `translate(${moveX / depth}px, ${moveY / depth}px)`;
      });
    };
  
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  

  // 📨 Handle form submission (Simplified using the existing logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      form.reset();
      setStatus("SUCCESS");
    } else {
      setStatus("ERROR");
    }
  };

  // ------------------------------------------------------------------
  // --- RENDER BEGINS HERE ---
  // ------------------------------------------------------------------

  const navItems = ["Home", "About", "Skills and qualifications","Tools and technologies", "Projects", "Contact"];

  return (

    <div className="relative bg-gradient-to-br from-gray-950 via-purple-950 to-black text-gray-100 min-h-screen flex flex-col overflow-x-hidden scroll-smooth">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 via-purple-700/20 to-pink-500/30 animate-gradientMove blur-3xl opacity-40"></div>

      {/* NAVBAR (Desktop + Mobile Toggle) */}
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-6 bg-black/40 backdrop-blur-sm shadow-md border-b border-gray-700 z-50">
        
        {/* Portfolio Name/Logo (Always visible) */}
        <a href="#home" className="text-2xl font-bold text-cyan-400">J.K. Dev</a>

        {/* Desktop Links (visible on 'lg' and up) */}
        <div className="hidden lg:flex space-x-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={"#" + item.toLowerCase().replace(/\s/g, "")}
              className="relative group text-lg font-medium tracking-wide"
            >
              <span className="transition-colors duration-300 group-hover:text-cyan-400">
                {item}
              </span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-40 group-hover:bg-cyan-400 blur-md transition-all duration-500"></span>
            </a>
          ))}
        </div>

        {/* Mobile Hamburger Button (visible on screens smaller than 'lg') */}
        <button
          className="lg:hidden text-2xl text-cyan-400 hover:text-cyan-300 transition-colors z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <i className="fa-solid fa-xmark"></i> // Close icon
          ) : (
            <i className="fa-solid fa-bars"></i> // Hamburger icon
          )}
        </button>
      </nav>

      {/* Mobile Menu (Side Drawer) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black/95 backdrop-blur-lg border-l border-gray-700 p-8 pt-24 z-40 transform transition-transform duration-500 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={"#" + item.toLowerCase().replace(/\s/g, "")}
              onClick={() => setIsMenuOpen(false)} // Close menu on click
              className="text-xl font-medium text-gray-200 hover:text-cyan-400 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
      {/* Overlay to click outside and close the menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden" 
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
      
      {/* HOME SECTION */}
      <section
        id="home"
        className="flex-grow flex flex-col items-center justify-center text-center p-10 relative z-10 min-h-screen pt-24" // Added pt-24 for padding below fixed nav
      >
        <h1 className="text-6xl sm:text-7xl font-extrabold text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] mb-6 animate-slideInTitle">
          Welcome to My Portfolio
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-gray-300 leading-relaxed animate-fadeUp delay-200">
  I’m <span className="text-white font-semibold">Jonah Kimani</span>, a creative problem solver passionate about building tech that matters.  
  From <span className="text-cyan-400 font-semibold">full-stack development</span> to <span className="text-cyan-400 font-semibold">IT infrastructure</span>,  
  my focus is crafting seamless digital experiences that make a real impact.
</p>

      </section>

      
      {/* ABOUT SECTION */}
        <section
          id="about"
          className="relative flex flex-col lg:flex-row items-center justify-center px-8 py-24 gap-16 min-h-screen bg-black border-t border-gray-800 overflow-hidden"
        >
          {/* Animated Gradient Aura Background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2),transparent_70%)] animate-pulseSlow"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 via-purple-700 to-pink-500 opacity-30 blur-3xl rounded-[40px] animate-borderGlow"></div>

          {/* PROFILE IMAGE */}
          <div className="relative group">
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700 transform hover:scale-105 transition duration-700">
              <img
                src="/images/kim.jpg"
                alt="Jonah Kimani image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ABOUT TEXT */}
          <div className="max-w-xl text-center lg:text-left space-y-6 animate-slideIn relative z-10">
            <h2 className="text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
              About Me
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed text-justify">
          I’m a passionate IT professional and full-stack developer with a strong focus on creating seamless digital experiences. 
          My journey in technology has allowed me to explore diverse areas — from web and mobile app development to backend engineering 
          and UI/UX design. I enjoy solving real-world problems through clean, efficient code and innovative solutions.
        </p>

        <p className="text-gray-300 text-lg leading-relaxed text-justify mt-6">
          I specialize in Web and Android development, building scalable applications that blend performance with great 
          user experience. Beyond coding, I’m deeply curious about emerging technologies like AI integration, automation, and cloud computing, 
          constantly pushing myself to stay ahead in the tech landscape. Outside of development, I’m driven by collaboration, creativity, 
          and continuous learning — always striving to deliver impactful solutions that make a difference in people’s lives.
        </p>

            <p className="text-gray-400 italic">
          “Behind every clean line of code is a spark of imagination.”
        </p>

        <p className="text-gray-300 text-base leading-relaxed">
          With a strong foundation in{" "}
          <span className="text-cyan-400 font-semibold">software development</span>,{" "}
          <span className="text-cyan-400 font-semibold">network administration</span>, and{" "}
          <span className="text-cyan-400 font-semibold">IT infrastructure management</span>, 
          I focus on building secure, scalable, and user-centered solutions that bridge technology and innovation.
        </p>

  </div>

  <style>{`
    @keyframes borderGlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-borderGlow {
      background-size: 200% 200%;
      animation: borderGlow 8s ease infinite;
    }

    @keyframes pulseSlow {
      0%, 100% { opacity: 0.15; }
      50% { opacity: 0.3; }
    }
    .animate-pulseSlow {
      animation: pulseSlow 6s ease-in-out infinite;
    }
  `}</style>
</section>


      {/* SKILLS & QUALIFICATIONS SECTION */}
      <section
        id="skillsandqualifications"
        className="relative flex flex-col items-center justify-center px-8 py-24 min-h-screen bg-gradient-to-b from-purple-950/30 to-black/40 border-t border-gray-700"
      >
        <h2 className="text-5xl font-bold text-cyan-400 mb-12 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-fadeUp">
          Skills & Qualifications
        </h2>

        {/* Qualifications */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16 animate-fadeUp delay-200">
          {[
            {
              title: "BSc. Information Technology",
              place: "Kenyatta University",
              year: "2025",
              icon: "🎓",
            },
            {
              title: "Certified Network Associate (CCNA)",
              place: "Alison Academy",
              year: "2022",
              icon: "🌐",
            },
            {
              title: "Full-Stack Web Development",
              place: "FreeCodeCamp / Udemy",
              year: "2024",
              icon: "💻",
            },
          ].map((q, i) => (
            <div
              key={i}
              className="relative bg-gray-900/60 rounded-2xl p-6 text-center shadow-lg border border-gray-700 hover:border-cyan-400 hover:shadow-cyan-400/40 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{q.icon}</div>
              <h3 className="text-xl font-semibold text-cyan-300">{q.title}</h3>
              <p className="text-gray-400">{q.place}</p>
              <span className="text-gray-500 text-sm">{q.year}</span>
            </div>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl animate-slideIn">
          {[
            {
              category: "Frontend Development",
              skills: ["React", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"],
            },
            {
              category: "Backend & Databases",
              skills: ["Django", "Node.js", "MySQL", "REST APIs"],
            },
            {
              category: "IT Support & Networking",
              skills: ["System Maintenance", "LAN/WAN Setup", "Troubleshooting", "Hardware Repair"],
            },
            {
              category: "Version Control & Tools",
              skills: ["Git", "VS Code", "Postman", "Linux CLI"],
            },
            {
              category: "Core Languages",
              skills: ["Javascript", "Python", "C & C++", "Java", "Prolog", "HTML"],
            },
          ].map((block, i) => (
            <div
              key={i}
              className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-cyan-400/30 transition-all duration-500 hover:-translate-y-2"
            >
              <h3 className="text-2xl font-semibold text-cyan-300 mb-4">
                {block.category}
              </h3>
              <ul className="space-y-2">
                {block.skills.map((skill, j) => (
                  <li
                    key={j}
                    className="text-gray-300 flex items-center gap-2 group"
                  >
                    <span className="w-2 h-2 bg-cyan-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      
   {/* TOOLS & TECHNOLOGIES SECTION */}
<section
  id="toolsandtechnologies"
  className="relative flex flex-col items-center justify-center px-8 py-24 min-h-screen border-t border-gray-800 overflow-hidden bg-black bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/bgimage.jpg')",
  }}
>
  {/* Magenta Glow Overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.25),transparent_70%)] animate-gradientMove blur-3xl opacity-50"></div>
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Section Title */}
  <h2 className="text-5xl font-extrabold text-pink-400 text-center mb-16 drop-shadow-[0_0_25px_rgba(255,0,255,0.8)] animate-fadeUp relative z-10">
    Tools & Technologies
  </h2>

  {/* Grid for Categories */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-6xl text-center relative z-10">
    {[
      {
        title: "🌐 Web Development",
        description: "React, Django, Tailwind CSS, JavaScript (ES6+), HTML5, CSS3, REST APIs, JSON, Vite",
        icons: [
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        ],
      },
      {
        title: "🤖 Android Development",
        description: "Android Studio, Java, Kotlin, Firebase, XML Layouts, Material Design",
        icons: [
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
        ],
      },
      {
        title: "🎨 Graphic & UI Design",
        description: "Adobe Photoshop, Illustrator, Figma, Canva, UX Wireframing, Filmora Wondershare, Prototyping",
        icons: [
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
        ],
      },
      {
        title: "💻 Coding Environments",
        description: "VS Code, Visual Studio, Git, GitHub, Terminal, Bash, Postman, Docker",
        icons: [
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terminal/terminal-plain.svg",
        ],
      },
      {
        title: "🗄️ Databases & Backend",
        description: "MySQL, PostgreSQL, SQLite, Django ORM, REST Framework, JSON Handling",
        icons: [
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
        ],
      },
      {
        title: "⚙️ Other Tools",
        description: "Linux, Ubuntu, Notion, Discord, Trello, Slack, Cloud Deployments",
        icons: [
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/discordjs/discordjs-plain.svg",
        ],
      },
    ].map((category, i) => (
      <div
        key={i}
        className="bg-gray-900/70 p-8 rounded-2xl border border-gray-800 shadow-lg backdrop-blur-lg transition-all duration-500 hover:border-pink-400/50 hover:shadow-pink-400/30 hover:scale-105 animate-slideIn"
        style={{ animationDelay: `${i * 0.2}s` }}
      >
        <h3 className="text-2xl font-bold text-pink-300 mb-6 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
          {category.title}
        </h3>
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          {category.icons.map((icon, j) => (
            <img
              key={j}
              src={icon}
              alt={category.title + ' icon'}
              className="w-14 h-14 p-2 bg-gray-800 rounded-full border border-pink-400/30 hover:border-pink-400 hover:scale-125 transition-all duration-300 shadow-[0_0_15px_rgba(255,0,255,0.4)]"
              style={{ animationDelay: `${j * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-gray-200 text-sm leading-relaxed animate-fadeUp">
          {category.description}
        </p>
      </div>
    ))}
  </div>

  {/* Animations */}
  <style>{`
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradientMove {
      background-size: 200% 200%;
      animation: gradientMove 10s ease infinite;
    }
    @keyframes fadeUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    .animate-fadeUp {
      animation: fadeUp 1s ease forwards;
    }
    @keyframes slideIn {
      0% { transform: translateX(60px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    .animate-slideIn {
      animation: slideIn 1s ease forwards;
    }
  `}</style>
</section>


      {/* PROJECTS SECTION */}
<section
  id="projects"
  className="relative px-8 py-24 bg-gradient-to-b from-black via-gray-950 to-purple-950 border-t border-gray-800 overflow-hidden"
>
  {/* Animated Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_70%)] animate-pulseSlow"></div>

  {/* Section Heading */}
  <h2 className="text-5xl font-extrabold text-center text-cyan-400 mb-16 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] animate-popIn">
    My Projects
  </h2>

  {/* Projects Grid */}
  <div className="grid gap-12 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 relative z-10">
    {/* Project 1 - FindMe */}
    <div className="group bg-gray-900/60 border border-gray-700 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-500 backdrop-blur-md animate-fadeUp">
      <div className="relative overflow-hidden rounded-xl mb-6">
      <img
        src="/images/findme.png"
        alt="FindMe Web App"
        onClick={() => handleImageClick("/images/findme.png")}
        className="w-full h-52 object-cover transform group-hover:scale-110 transition-all duration-700 cursor-pointer"
      />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      </div>
      <h3 className="text-2xl font-bold text-cyan-300 mb-2">
        FindMe – Missing Persons WebApp
      </h3>
      <p className="text-gray-300 leading-relaxed">
        <span className="text-cyan-400 font-semibold">FindMe</span> is a
        real-time web application that helps reunite missing and found
        individuals with their families. It uses{" "}
        <span className="text-cyan-400 font-semibold">
          AI-powered face matching
        </span>{" "}
        and live updates to increase the chances of successful reunions.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Django", "React", "MySQL", "AI/Face Recognition", "REST API"].map(
          (tech, i) => (
            <span
              key={i}
              className="bg-cyan-500/10 text-cyan-300 text-sm px-3 py-1 rounded-full border border-cyan-500/30"
            >
              {tech}
            </span>
          )
        )}
      </div>
    </div>

    {/* Project 2 - Industrial Express */}
    <div className="group bg-gray-900/60 border border-gray-700 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-500 backdrop-blur-md animate-fadeUp delay-200">
      <div className="relative overflow-hidden rounded-xl mb-6">
        <img
          src="/images/industrialexpress.png"
          alt="Industrial Express"
          onClick={() => handleImageClick("/images/industrialexpress.png")}
          className="w-full h-52 object-cover transform group-hover:scale-110 transition-all duration-700 cursor-pointer"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
         </div>
      <h3 className="text-2xl font-bold text-cyan-300 mb-2">
        Industrial Express – E-Commerce Platform
      </h3>
      <p className="text-gray-300 leading-relaxed">
        <span className="text-cyan-400 font-semibold">Industrial Express</span>{" "}
        is a full-featured e-commerce web app for selling industrial products.
        It includes <span className="text-cyan-400 font-semibold">secure
        payments</span>, <span className="text-cyan-400 font-semibold">smart
        inventory management</span>, and a modern user interface for seamless
        shopping experiences.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["React", "Node.js", "MongoDB", "Express", "Stripe API"].map(
          (tech, i) => (
            <span
              key={i}
              className="bg-cyan-500/10 text-cyan-300 text-sm px-3 py-1 rounded-full border border-cyan-500/30"
            >
              {tech}
            </span>
          )
        )}
      </div>
    </div>

    {/* Project 3 - HotelEase */}
    <div className="group bg-gray-900/60 border border-gray-700 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-500 backdrop-blur-md animate-fadeUp delay-400">
      <div className="relative overflow-hidden rounded-xl mb-6">
        <img
          src="/images/hotelease.png"
          alt="HotelEase Management System"
          onClick={() => handleImageClick("/images/hotelease.png")}
          className="w-full h-52 object-cover transform group-hover:scale-110 transition-all duration-700 cursor-pointer"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
         </div>
      <h3 className="text-2xl font-bold text-cyan-300 mb-2">
        HotelEase – Hotel Management System
      </h3>
      <p className="text-gray-300 leading-relaxed">
        <span className="text-cyan-400 font-semibold">HotelEase</span> is a
        hotel management solution that simplifies booking, order processing,
        and staff coordination. It features{" "}
        <span className="text-cyan-400 font-semibold">real-time room tracking</span>{" "}
        and <span className="text-cyan-400 font-semibold">automated reports</span>{" "}
        to streamline daily hotel operations.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Django", "React", "PostgreSQL", "TailwindCSS", "WebSockets"].map(
          (tech, i) => (
            <span
              key={i}
              className="bg-cyan-500/10 text-cyan-300 text-sm px-3 py-1 rounded-full border border-cyan-500/30"
            >
              {tech}
            </span>
          )
        )}
      </div>
    </div>
  </div>


{selectedImage && (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative">
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 bg-gray-800 text-white text-lg px-3 py-1 rounded-full hover:bg-cyan-500 transition"
        >
          ×
        </button>
        <img
          src={selectedImage}
          alt="Enlarged project"
          className="max-w-3xl w-[90vw] rounded-xl shadow-lg transform animate-zoomIn"
        />
      </div>
    </div>
  )}

  {/* Animations */}
  <style>{`
    @keyframes fadeUp {
      0% { transform: translateY(30px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    .animate-fadeUp {
      animation: fadeUp 1.2s ease forwards;
    }
    .animate-pulseSlow {
      animation: pulseSlow 6s ease-in-out infinite;
    }
    @keyframes pulseSlow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }

    /* ✅ Added animations for the zoom-in overlay */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes zoomIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-zoomIn {
      animation: zoomIn 0.3s ease-out;
    }
  `}</style>
  </section>

      {/* CONTACT SECTION */}
<section
  id="contact"
  className="relative flex flex-col items-center justify-center px-8 py-24 min-h-screen bg-black border-t border-gray-800 overflow-hidden"
>
  {/* 🌌 Animated Stars */}
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="stars"></div>
    <div className="stars2"></div>
    <div className="stars3"></div>
  </div>
  {/* Background Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_70%)] animate-pulseSlow"></div>

  {/* Heading */}
  <h2 className="text-5xl font-extrabold text-cyan-400 text-center mb-12 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)] animate-popIn">
    Get in Touch
  </h2>

  {/* Contact Form */}
<form
  action="https://formspree.io/f/xpwozgol"
  method="POST"
  onSubmit={async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();

    // 🧠 Basic validation
    if (!name || !email || !message) {
      alert("⚠️ Please fill out all fields before sending your message.");
      return;
    }

    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("⚠️ Please enter a valid email address.");
      return;
    }

    // 📤 Send form data to Formspree
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      alert("✅ Message sent successfully! Thank you for reaching out.");
      form.reset();
    } else {
      alert("❌ Something went wrong. Please try again later.");
    }
  }}
  className="bg-gray-900/60 p-8 rounded-2xl shadow-lg border border-gray-700 w-full max-w-xl space-y-6 backdrop-blur-md animate-slideIn"
>
  <div>
    <label className="block text-gray-400 mb-2">Your Name</label>
    <input
      type="text"
      name="name"
      placeholder="Enter your name"
      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-400 text-gray-200 transition-all duration-300"
    />
  </div>

  <div>
    <label className="block text-gray-400 mb-2">Your Email</label>
    <input
      type="email"
      name="email"
      placeholder="Enter your email"
      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-400 text-gray-200 transition-all duration-300"
    />
  </div>

  <div>
    <label className="block text-gray-400 mb-2">Message</label>
    <textarea
      name="message"
      rows="5"
      placeholder="Write your message..."
      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-400 text-gray-200 transition-all duration-300"
    ></textarea>
  </div>

  <button
    type="submit"
    className="w-full py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-300 rounded-lg font-semibold hover:bg-cyan-500/30 hover:shadow-cyan-400/40 shadow-md transition-all duration-300"
  >
    Send Message
  </button>
</form>


  {/* Social Links */}
  <div className="flex space-x-8 mt-16 animate-popIcons">
    {[
      {
        name: "GitHub",
        icon: "fa-brands fa-github",
        link: "https://github.com/Cjaycoddev?tab=overview&from=2023-12-01&to=2023-12-31",
      },
      {
        name: "LinkedIn",
        icon: "fa-brands fa-linkedin",
        link: "https://www.linkedin.com/in/jonah-kimani-wainaina-4557a52b0?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
      {
        name: "Email",
        icon: "fa-solid fa-envelope",
        link: "https://mail.google.com/mail/?view=cm&fs=1&to=Jonahkimani254@gmail.com&su=Let's%20Connect&body=Hi%20Jonah,%0A%0A",
      },
    ].map((social, i) => (
      <a
        key={i}
        href={social.link}
        target="_blank"
        rel="noreferrer"
        className="text-3xl text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-125"
      >
        <i className={social.icon}></i>
      </a>
    ))}
  </div>
  {/* Copyright Footer */}
<footer className="mt-16 text-gray-500 text-sm text-center border-t border-gray-700 pt-8 animate-fadeIn">
  © {new Date().getFullYear()} <span className="text-cyan-400 font-semibold">Jonah Kimani</span>. All rights reserved.
</footer>


  {/* Sound effect when section appears */}
  <audio id="popSound" src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_56fc1b8a39.mp3?filename=pop-94319.mp3"></audio>

  <style>{`
    @keyframes popIn {
      0% { transform: scale(0.8); opacity: 0; }
      60% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1); }
    }
    .animate-popIn {
      animation: popIn 1.2s ease forwards;
    }

    @keyframes popIcons {
      0%, 10% { opacity: 0; transform: scale(0); }
      30% { opacity: 1; transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    .animate-popIcons {
      animation: popIcons 1.2s ease-in-out 0.5s forwards;
    }

    @keyframes pulseSlow {
      0%, 100% { opacity: 0.15; }
      50% { opacity: 0.3; }
    }
    .animate-pulseSlow {
      animation: pulseSlow 6s ease-in-out infinite;
    }
    
    /* Custom CSS for Star Parallax */
    .stars, .stars2, .stars3 {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: repeat;
      background-position: center;
      transition: transform 0.1s linear; /* Smooth mouse movement */
    }

    .stars {
      background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0));
      background-size: 800px 800px;
    }
    .stars2 {
      background-image: radial-gradient(3px 3px at 40px 70px, #fff, rgba(0,0,0,0));
      background-size: 1000px 1000px;
    }
    .stars3 {
      background-image: radial-gradient(4px 4px at 50px 10px, #ddd, rgba(0,0,0,0));
      background-size: 1200px 1200px;
    }
  `}</style>
</section>


      {/* Extra subtle glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Custom Animations */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradientMove {
          background-size: 200% 200%;
          animation: gradientMove 10s ease infinite;
        }

        @keyframes fadeUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeUp {
          animation: fadeUp 1s ease forwards;
        }

        @keyframes slideIn {
          0% { transform: translateX(50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 1.2s ease forwards;
        }

        @keyframes slideInTitle {
          0% { transform: translateY(80px) scale(0.95); opacity: 0; }
          60% { transform: translateY(-10px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slideInTitle {
          animation: slideInTitle 1.4s cubic-bezier(0.25, 1, 0.3, 1) forwards;
        }
      `}</style>
      <FloatingAssistant />
    </div>
  );
}
