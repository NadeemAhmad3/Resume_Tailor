// components/footer.tsx
"use client";
import { motion, useMotionValue } from "framer-motion";
import { Mail, Twitter, Linkedin, Github, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "API", href: "#api" },
  ],
  Resources: [
    { label: "Blog", href: "#blog" },
    { label: "Career Hub", href: "#career-hub" },
    { label: "Templates", href: "#templates" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
  ],
};

export default function Footer() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <footer className="relative w-full bg-slate-50 overflow-hidden">
      
      {/* Wave animation at the TOP of the footer */}
      <div className="absolute top-0 left-0 w-full h-32 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ transform: 'scaleY(-1) scaleX(-1)' }}
        >
          <motion.path
            fill="url(#footer-gradient)"
            fillOpacity="0.3"
            d="M0,160 C320,300,420,300,740,160 C1060,20,1160,20,1440,160 L1440,320 L0,320 Z"
            animate={{
              d: [
                "M0,160 C320,300,420,300,740,160 C1060,20,1160,20,1440,160 L1440,320 L0,320 Z",
                "M0,180 C320,260,420,260,740,180 C1060,100,1160,100,1440,180 L1440,320 L0,320 Z",
                "M0,160 C320,300,420,300,740,160 C1060,20,1160,20,1440,160 L1440,320 L0,320 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="footer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Background effects */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-lg transition duration-300"
        style={{
          background: `radial-gradient(600px at ${mouseX.get()}px ${mouseY.get()}px, rgba(167, 139, 250, 0.15), transparent 80%)`,
        }}
      />
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-0 left-0 h-96 w-96 bg-blue-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, typeof window !== 'undefined' ? window.innerWidth - 384 : 0, 0],
            y: [0, 300, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-96 w-96 bg-pink-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, typeof window !== 'undefined' ? -(window.innerWidth - 384) : 0, 0],
            y: [0, -300, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 2.5 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Main footer content */}
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Resume<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tailor</span>
              </Link>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Transform your resume with AI-powered precision. Get noticed by recruiters and land your dream job faster.
              </p>
              
              <div className="mt-6">
                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="email"
                    placeholder="Stay updated"
                    className="flex-1 px-3 py-2 bg-slate-100/70 backdrop-blur-sm border border-slate-200/60 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md"
                  >
                    <Mail className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <h3 className="text-gray-900 font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="text-gray-600 hover:text-purple-600 transition-colors duration-200 w-fit"
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* --- CORRECTED: Original Centered Layout --- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              whileHover={{ scale: 1.1, y: -2, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg hover:shadow-purple-300/50 transition-all"
            >
              <social.icon className="w-5 h-5 text-white" />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-8 border-t border-slate-200/80 flex items-center justify-center gap-1.5 text-sm text-gray-500"
        >
            <span>Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
            </motion.span>
            <span>by</span>
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Nadeem</span>
            <span>@2025 all right reserved</span>
        </motion.div>
      </div>
    </footer>
  );
}