import React, { useState } from 'react';
import { Mail, Phone, Landmark, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 text-left" id="contact-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4 text-center">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Interactive Support Desk</span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight sm:text-4xl">
            Contact MedVerify Compliance
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto text-center font-medium">
            Are you a medical supplier, state regulator, or consumer seeking technical or security information? Submit your inquiry below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="md:col-span-12 lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance Offices</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <Landmark className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800">Global Headquarters</h4>
                  <p className="text-slate-500 mt-1 font-medium">
                    902 Health Plaza Corridor, Suit 40B<br />
                    New York, NY 10013
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800">Telephone Hotline</h4>
                  <p className="text-slate-500 mt-1 leading-normal font-medium">
                    +1 (800) 555-VERIFY<br />
                    Mon - Fri, 9:00 AM - 5:00 PM EST
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800">Administrative Email</h4>
                  <a href="mailto:compliance@medverify.com" className="text-blue-600 hover:underline font-bold block mt-1">
                    compliance@medverify.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interaction Form */}
          <div className="md:col-span-12 lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            {formSubmitted ? (
               <div className="text-center py-12 space-y-4">
                <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Inquiry Received Successfully</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  Our medical compliance representatives will audit your submission and respond within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2.5 rounded-xl text-xs border border-blue-100 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Send Secure Message</h3>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. pharmacy@care.com"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-3 text-xs transition-colors shadow-inner"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Subject Line
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Batch Registration Verification Support"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-3 text-xs transition-colors shadow-inner"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Detailed Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify your license details or inquiry..."
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-3 text-xs transition-colors shadow-inner"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-xs font-bold"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Secure Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
