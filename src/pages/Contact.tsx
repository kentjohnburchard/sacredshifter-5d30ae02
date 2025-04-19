
import React from 'react';
import Layout from '@/components/Layout';

const Contact: React.FC = () => {
  return (
    <Layout pageTitle="Contact">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-6">
          We'd love to hear from you! Reach out with any questions or feedback.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-purple-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-purple-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  className="w-full px-4 py-2 border rounded-md h-32 focus:ring focus:ring-purple-300"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Connect with us</h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="font-medium mr-2">Email:</span> 
                  <a href="mailto:info@sacredshifter.com" className="text-purple-600 hover:underline">
                    info@sacredshifter.com
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Phone:</span> 
                  <a href="tel:+1234567890" className="text-purple-600 hover:underline">
                    (123) 456-7890
                  </a>
                </p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
              <p className="mb-1">Monday - Friday: 9am - 5pm</p>
              <p>Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
