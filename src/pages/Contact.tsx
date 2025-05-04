
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, MessageCircle, Mail, Send, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    submitted: false,
    loading: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({...formState, loading: true});

    // Simulate form submission
    setTimeout(() => {
      setFormState({...formState, submitted: true, loading: false});
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond soon.",
        duration: 5000
      });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({...formState, [name]: value});
  };

  return (
    <Layout 
      pageTitle="Contact | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300"
          style={{textShadow: '0 2px 10px rgba(79, 70, 229, 0.7)'}}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contact Us
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-black/60 border-indigo-500/30 backdrop-blur-md overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-200">
                  <MessageCircle className="h-5 w-5" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formState.submitted ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-indigo-200 mb-2">Message Received</h3>
                    <p className="text-gray-300">
                      Thank you for reaching out to Sacred Shifter. We'll respond to your inquiry shortly.
                    </p>
                    <Button 
                      className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600" 
                      onClick={() => setFormState({...formState, submitted: false})}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-indigo-200">Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formState.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="bg-indigo-500/10 border-indigo-500/30 placeholder:text-indigo-200/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-indigo-200">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                          className="bg-indigo-500/10 border-indigo-500/30 placeholder:text-indigo-200/30"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-indigo-200">Subject</Label>
                      <Input 
                        id="subject" 
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        placeholder="What's this about?"
                        className="bg-indigo-500/10 border-indigo-500/30 placeholder:text-indigo-200/30"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-indigo-200">Message</Label>
                      <Textarea 
                        id="message" 
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        placeholder="Share your thoughts or questions..."
                        rows={6}
                        className="bg-indigo-500/10 border-indigo-500/30 placeholder:text-indigo-200/30"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600"
                      disabled={formState.loading}
                    >
                      {formState.loading ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-black/60 border-indigo-500/30 backdrop-blur-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-200 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Us
              </h3>
              <div className="space-y-4 text-gray-200">
                <p>For general inquiries:</p>
                <p className="text-indigo-300 font-medium">hello@sacredshifter.com</p>
                
                <p>For support:</p>
                <p className="text-indigo-300 font-medium">support@sacredshifter.com</p>
                
                <p>For partnership opportunities:</p>
                <p className="text-indigo-300 font-medium">partners@sacredshifter.com</p>
              </div>
            </Card>

            <Card className="bg-black/60 border-indigo-500/30 backdrop-blur-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-200 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Our Location
              </h3>
              <div className="space-y-2 text-gray-200">
                <p>Sacred Shifter Headquarters</p>
                <p>123 Harmonic Way</p>
                <p>Sedona, AZ 86336</p>
                <p>United States</p>
              </div>
              <div className="mt-4 h-40 w-full bg-indigo-900/30 rounded-md flex items-center justify-center">
                <p className="text-indigo-200/50 text-sm">Interactive map will be displayed here</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
