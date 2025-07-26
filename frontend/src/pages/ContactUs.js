import React, { useState } from 'react';
import './ContactUs.css';
import Sidebar from '../components/Sidebar';

const ContactUs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="contact-page">
      <div className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <h2>Contact Us</h2>
      <p>Email: support@example.com</p>
      <p>Phone: +91 9876543210</p>

      <h3>Our Services</h3>
      <p>• Custom Design Stitching</p>
      <p>• Doorstep Measurement & Delivery</p>
      <p>• 3D Dress Preview with AR</p>
      <p>• Designer Consultations</p>

      <h3>FAQs</h3>
      <p><strong>Q:</strong> Can I schedule a consultation online?<br /><strong>A:</strong> Yes! Use the app or call us directly.</p>

      <p><strong>Q:</strong> Is the 3D preview compatible with all phones?<br /><strong>A:</strong> Most modern smartphones support it — we’ll guide you through.</p>

      <p><strong>Q:</strong> Do you deliver outside Tamil Nadu?<br /><strong>A:</strong> Yes, pan-India delivery is available.</p>
    </div>
  );
};

export default ContactUs;
