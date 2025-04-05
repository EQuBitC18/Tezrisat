// @ts-ignore
import {Link, useNavigate} from "react-router-dom";
//import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"

// @ts-ignore
import { Button } from "@/components/ui/button"
// @ts-ignore
import { Card, CardContent } from "@/components/ui/card"
// @ts-ignore
import { AnimatedBlob } from "../components/animated-blob"
// @ts-ignore
import { FloatingShapes } from "../components/floating-shapes"
import {useEffect, useState} from "react";

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate();

  // Check if page is scrolled for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigateToSignup = () => {
    navigate('/register');
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900 via-teal-700 to-teal-300 -z-10" />

      {/* Animated background elements */}
      <AnimatedBlob className="absolute top-20 left-10 opacity-30 -z-5" />
      <AnimatedBlob className="absolute bottom-40 right-10 opacity-20 -z-5" />
      <FloatingShapes className="absolute inset-0 -z-5" />

        <div className="container relative px-4 py-24 mx-auto max-w-7xl">
            {/* Sticky header */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? "bg-teal-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
          }`}
        >
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <Link to="/" className="flex items-center gap-2">
              <img
                  src="../../public/Tezrisat_Logo_Transparent.png"
                  alt="Tezrisating Platform Interface"
                  style={{width: "6%", height: "5%", objectFit: "contain"}}
                  className="hidden md:block"
              />
              <span className="text-xl font-bold text-white">Tezrisat</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {/*<Link to="#features" className="text-sm font-medium text-white hover:text-teal-200 transition-colors">
                Features
              </Link>*/}
              {/*<Link to="#testimonials" className="text-sm font-medium text-white hover:text-teal-200 transition-colors">
                Testimonials
              </Link>*/}
            </nav>
            <div className="flex gap-4">
              <Button className="bg-teal-200 text-teal-900 hover:bg-teal-100" onClick={navigateToSignup}>Get Started</Button>
            </div>
          </div>
        </header>
            {/* Hero section */}
            <div className="text-center mb-24">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-6">
                    Transforming Learning Through AI
                </h1>
                <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
                    We're on a mission to make knowledge accessible, personalized, and engaging through AI-powered
                    microcourses
                    that adapt to your learning style.
                </p>
            </div>

            {/* Our Story */}
            <div className="grid md:grid-cols-1 gap-12 items-center mb-32">
                <div className="order-2 md:order-1">
                    <div
                        className="bg-white/40 backdrop-blur-sm rounded-3xl border border-teal-200/50 shadow-xl p-8 md:p-10 h-full">
                        <h2 className="text-3xl font-bold text-teal-900 mb-6">Our Story</h2>
                        <div className="space-y-4 text-teal-800">
                            <p>
                                Founded in 2022, our journey began when a team of educators, technologists, and AI
                                researchers came
                                together with a shared vision: to revolutionize how people learn in the digital age.
                            </p>
                            <p>
                                We noticed that traditional learning methods weren't adapting to the fast-paced,
                                information-rich
                                world we live in. People needed a way to quickly acquire specific knowledge without
                                wading through
                                hours of content or generic courses.
                            </p>
                            <p>
                                That's when we created our AI-powered microcourse generator—a platform that combines
                                cutting-edge
                                language models with educational best practices to create personalized, bite-sized
                                learning
                                experiences on any topic.
                            </p>
                            <p>
                                Today, we're proud to serve thousands of learners worldwide, from students and
                                professionals to
                                lifelong learners and organizations seeking to upskill their teams efficiently.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission & Vision</h2>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto">
                        We're building the future of personalized learning, one microcourse at a time.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card
                        className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <CardContent className="p-8 md:p-10">
                            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-teal-900 mb-4">Our Mission</h3>
                            <p className="text-teal-800 mb-4">
                                To democratize knowledge by making high-quality, personalized learning accessible to
                                everyone,
                                regardless of their background, location, or resources.
                            </p>
                            <p className="text-teal-800">
                                We believe that by harnessing the power of AI, we can break down traditional barriers to
                                education and
                                create learning experiences that adapt to individual needs, learning styles, and goals.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <CardContent className="p-8 md:p-10">
                            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M12 20v-6M6 20V10M18 20V4"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-teal-900 mb-4">Our Vision</h3>
                            <p className="text-teal-800 mb-4">
                                A world where anyone can learn anything, anytime, in a way that's perfectly tailored to
                                their needs.
                            </p>
                            <p className="text-teal-800">
                                We envision a future where AI-powered learning is the norm, not the exception—where
                                personalized
                                microcourses enable continuous learning throughout life, helping people adapt to an
                                ever-changing
                                world and unlock their full potential.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Company Values */}
            <div className="mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Values</h2>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto">
                        These core principles guide everything we do, from product development to customer interactions.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card
                        className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path>
                                    <path d="M12 13v8"></path>
                                    <path d="M5 13v6a2 2 0 0 0 2 2h8"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-teal-900 mb-3">Accessibility First</h3>
                            <p className="text-teal-800">
                                We believe knowledge should be accessible to everyone. We design our platform and
                                content to be inclusive,
                                affordable, and available across different devices and learning contexts.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path
                                        d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <path d="M12 18v-6"></path>
                                    <path d="M8 18v-1"></path>
                                    <path d="M16 18v-3"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-teal-900 mb-3">Educational Excellence</h3>
                            <p className="text-teal-800">
                                We're committed to creating learning experiences that are not just convenient, but truly
                                effective. Every
                                feature and content piece is designed with sound educational principles in mind.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                                    <path d="m9 12 2 2 4-4"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-teal-900 mb-3">Ethical AI</h3>
                            <p className="text-teal-800">
                                We develop and use AI responsibly, with transparency about its capabilities and
                                limitations. We prioritize
                                user privacy, data security, and fairness in our algorithms and content generation.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M12 2v4"></path>
                                    <path d="M12 18v4"></path>
                                    <path d="M4.93 4.93l2.83 2.83"></path>
                                    <path d="M16.24 16.24l2.83 2.83"></path>
                                    <path d="M2 12h4"></path>
                                    <path d="M18 12h4"></path>
                                    <path d="M4.93 19.07l2.83-2.83"></path>
                                    <path d="M16.24 7.76l2.83-2.83"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-teal-900 mb-3">Continuous Innovation</h3>
                            <p className="text-teal-800">
                                We're never satisfied with the status quo. We constantly push the boundaries of what's
                                possible in
                                AI-powered learning, experimenting with new approaches and technologies to better serve
                                our users.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-teal-900 mb-3">User-Centered Design</h3>
                            <p className="text-teal-800">
                                Our users are at the heart of everything we build. We actively seek feedback, conduct
                                user research, and
                                iterate based on real-world usage to create experiences that truly meet learners' needs.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path
                                        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                    <path d="m7 10 2 2 6-6"></path>
                                    <path d="m7 16 2 2 6-6"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-teal-900 mb-3">Quality & Accuracy</h3>
                            <p className="text-teal-800">
                                We're committed to delivering content that's not just engaging but accurate and
                                reliable. We continuously
                                refine our AI models and implement rigorous quality control processes to ensure
                                excellence.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Team Section */}
            {/*
            <div className="mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Meet Our Team</h2>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto">
                        We're a diverse group of educators, technologists, and AI enthusiasts united by our passion for
                        transforming learning.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TeamMember
                        name="Dr. Sarah Chen"
                        role="Founder & CEO"
                        bio="Former AI researcher at MIT with a passion for educational technology. Sarah leads our vision and strategy."
                        imageSrc="/placeholder.svg?height=400&width=400"
                    />
                    <TeamMember
                        name="Michael Rodriguez"
                        role="CTO"
                        bio="Ex-Google engineer with expertise in machine learning and natural language processing. Michael oversees our technology development."
                        imageSrc="/placeholder.svg?height=400&width=400"
                    />
                    <TeamMember
                        name="Dr. Aisha Patel"
                        role="Chief Learning Officer"
                        bio="Educational psychologist with 15+ years of experience in curriculum design. Aisha ensures our AI creates effective learning experiences."
                        imageSrc="/placeholder.svg?height=400&width=400"
                    />
                    <TeamMember
                        name="David Kim"
                        role="Head of Product"
                        bio="Former product leader at Khan Academy. David focuses on creating intuitive, engaging user experiences."
                        imageSrc="/placeholder.svg?height=400&width=400"
                    />
                    <TeamMember
                        name="Elena Gonzalez"
                        role="Head of AI Research"
                        bio="PhD in computational linguistics. Elena leads our efforts to continuously improve our AI models and learning algorithms."
                        imageSrc="/placeholder.svg?height=400&width=400"
                    />
                    <TeamMember
                        name="James Wilson"
                        role="Head of Customer Success"
                        bio="Former educator with a passion for helping others. James ensures our users get the most out of our platform."
                        imageSrc="/placeholder.svg?height=400&width=400"
                    />
                </div>
            </div>

            {/* Testimonials */}
            {/*
            <Card className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
              <CardContent className="p-8">
                <div className="mb-6">
                  <svg
                    width="40"
                    height="32"
                    viewBox="0 0 40 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-teal-500"
                  >
                    <path
                      d="M13.8889 0H0V12.4444C0 19.3067 5.58222 24.8889 12.4444 24.8889V32H20.3556V24.8889H13.8889C13.8889 20.7644 17.2089 17.4444 21.3333 17.4444V9.77778H13.8889V0Z"
                      fill="currentColor"
                    />
                    <path
                      d="M33.4444 0H19.5555V12.4444C19.5555 19.3067 25.1378 24.8889 32 24.8889V32H39.9111V24.8889H33.4444C33.4444 20.7644 36.7644 17.4444 40.8889 17.4444V9.77778H33.4444V0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <p className="text-teal-800 mb-6">{quote}</p>

                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image src={imageSrc || "/placeholder.svg"} alt={author} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-teal-900">{author}</h4>
                    <p className="text-sm text-teal-700">{role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            */}

            {/* Contact Section */}
            {/*
            <div className="mt-32">
                <div
                    className="bg-white/40 backdrop-blur-sm rounded-3xl border border-teal-200/50 shadow-xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold text-teal-900 mb-6">Get in Touch</h2>
                            <p className="text-teal-800 mb-8">
                                Have questions about our platform or interested in partnering with us? We'd love to hear
                                from you!
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <Mail className="w-6 h-6 text-teal-600 mt-1 mr-4"/>
                                    <div>
                                        <h3 className="font-medium text-teal-900">Email Us</h3>
                                        <p className="text-teal-800">hello@microcourseai.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Phone className="w-6 h-6 text-teal-600 mt-1 mr-4"/>
                                    <div>
                                        <h3 className="font-medium text-teal-900">Call Us</h3>
                                        <p className="text-teal-800">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <MapPin className="w-6 h-6 text-teal-600 mt-1 mr-4"/>
                                    <div>
                                        <h3 className="font-medium text-teal-900">Visit Us</h3>
                                        <p className="text-teal-800">
                                            123 Innovation Way
                                            <br/>
                                            San Francisco, CA 94107
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <Link href="/contact" className="block">
                                <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700 text-white mb-4">
                                    Contact Us
                                </Button>
                            </Link>
                            <Link href="/demo" className="block">
                                <Button size="lg" variant="outline"
                                        className="w-full border-teal-600 text-teal-700 hover:bg-teal-50">
                                    Schedule a Demo
                                    <ArrowRight className="ml-2 h-4 w-4"/>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            */}
        </div>
    </div>
  )
}

