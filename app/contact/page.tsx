import ContactForm from '@/components/ContactForm';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';


export const metadata = {
    title: 'Contact Us - TakaHisab',
    description: 'Get in touch with our support team. We\'re here to help you manage your finances better.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background transition-colors duration-500 ">
            {/* Hero Section */}
            <Header />
            <div className="bg-gradient-to-b from-card to-background border-b border-border mt-16">
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
                <div className=" gap-8">
                    {/* Contact Information */}
                    {/* <div className="lg:col-span-1">
                        <div className="space-y-6">
                            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Mail size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                                        <p className="text-sm text-muted-foreground">[EMAIL_ADDRESS]</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Phone size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                                        <p className="text-sm text-muted-foreground">+1 (555) 000-0000</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Clock size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Response Time</h3>
                                        <p className="text-sm text-muted-foreground">24-48 hours</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <MapPin size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Location</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Dhaka, Bangladesh
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>
            </div>


            <Footer />
        </div>
    );
}
