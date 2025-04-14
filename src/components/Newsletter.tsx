import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, FileText } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: "Smart Email Generation",
    description: "Create personalized, professional emails that stand out"
  },
  {
    icon: FileText,
    title: "Dynamic CV Builder",
    description: "Tailor your resume to match job requirements perfectly"
  },
  {
    icon: Star,
    title: "AI-Powered Optimization",
    description: "Get the best results with our advanced AI algorithms"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    content: "Lettrai helped me tailor my resume perfectly for each application. Landed my dream job at Google!",
    avatar: "SJ",
    rating: 5,
    size: "lg" // Controls the card size
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    content: "The AI-powered email generator saves me hours every week. Highly recommended for job seekers.",
    avatar: "MC",
    rating: 5,
    size: "sm"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    content: "Finally, a tool that understands the nuances of professional communication. Game-changer!",
    avatar: "ER",
    rating: 5,
    size: "md"
  }
];

export function Newsletter() {
  return (
    <div className="relative">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#8B5CF6_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10"
        aria-hidden="true"
      />

      <div className="relative">
        {/* Features Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose Lettrai?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="glass-container p-6 rounded-xl text-center"
                >
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-4">
                    <Icon size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Testimonials with varying sizes */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`glass-container p-6 rounded-xl ${
                  testimonial.size === 'lg' 
                    ? 'md:col-span-2 lg:col-span-1 row-span-2'
                    : testimonial.size === 'md'
                    ? 'md:col-span-1 row-span-1'
                    : 'md:col-span-1 row-span-1'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}