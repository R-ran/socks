'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully.',
        });
        // 清空表单
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          message: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#e8e0ca] py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Contact Form Card */}
          <div className="bg-white rounded-3xl border-4 border-[#543313] p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#543313] mb-8">
              Contact Form
            </h1>

            {/* Success/Error Messages */}
            {submitStatus.type && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 border-2 border-green-200 text-green-800'
                    : 'bg-red-50 border-2 border-red-200 text-red-800'
                }`}
              >
                <p className="font-semibold">{submitStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#543313] font-bold mb-2">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-full border-2 border-[#543313] bg-[#f5c9e0] text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                  />
                </div>
                <div>
                  <label className="block text-[#543313] font-bold mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-full border-2 border-[#543313] bg-[#f5c9e0] text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                  />
                </div>
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#543313] font-bold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-full border-2 border-[#543313] bg-[#f5c9e0] text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                  />
                </div>
                <div>
                  <label className="block text-[#543313] font-bold mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-full border-2 border-[#543313] bg-[#f5c9e0] text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[#543313] font-bold mb-2">
                  Your Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="message"
                  placeholder="Comment"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-6 py-4 rounded-3xl border-2 border-[#543313] bg-[#f5c9e0] text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#d41872] hover:bg-[#b01560] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full font-bold text-lg transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Submit form'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
