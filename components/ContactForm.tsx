'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Thank you! We\'ll get back to you soon.');
                setFormData({ name: '', email: '', phone: '', message: '' });
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                toast.error(data.error || 'Failed to submit');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle size={64} className="text-green-500 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground text-center">
                    Your message has been sent successfully.<br />
                    We'll review your request and get back to you as soon as possible.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                    </label>
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-3.5 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                    </label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-3.5 text-muted-foreground pointer-events-none" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                    </label>
                    <div className="relative">
                        <Phone size={18} className="absolute left-3 top-3.5 text-muted-foreground pointer-events-none" />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Message Field */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                </label>
                <div className="relative">
                    <MessageSquare size={18} className="absolute left-3 top-3.5 text-muted-foreground pointer-events-none" />
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                        required
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-500 dark:to-emerald-500 hover:from-teal-700 hover:to-emerald-700 dark:hover:from-teal-600 dark:hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
            >
                <Send size={18} />
                {loading ? 'Sending...' : 'Send Message'}
            </button>

            <p className="text-center text-xs text-muted-foreground">
                We typically respond within 24-48 hours.
            </p>
        </form>
    );
}
