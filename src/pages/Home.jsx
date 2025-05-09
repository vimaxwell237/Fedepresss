import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import amazon from "../assets/images/amazon.svg";
import ups from "../assets/images/ups.svg";
import alibaba from "../assets/images/alibaba.svg";
import dhl from "../assets/images/dhl.svg";

import reliableShipping from "../assets/images/reliable-shipping.jpg";
import realTimeTracking from "../assets/images/Real-Time.jpg";
import smartLogistics from "../assets/images/Smart-Logistics.jpg";

const services = [
  { img: reliableShipping,    title: 'Reliable Shipping',    text: 'On-time delivery worldwide.' },
  { img: realTimeTracking,     title: 'Real-Time Tracking',   text: 'Track your package every step.' },
  { img: smartLogistics,       title: 'Smart Logistics',      text: 'Tailored solutions for you.' }
];

const partners = [
  { src: amazon,   alt: 'Amazon' },
  { src: ups,      alt: 'UPS' },
  { src: alibaba,  alt: 'Alibaba' },
  { src: dhl,      alt: 'DHL' }
];

const Home = () => (
  <div className="home-page">
    {/* Hero Section */}
    <section className="hero">
      <div className="hero-content">
        <h1>Delivering Excellence, Everywhere</h1>
        <p>Your trusted partner in global shipping & logistics.</p>
        <div className="cta-group">
          <Link to="/tracking" className="cta-button primary">
            Track Your Package
          </Link>
          <Link to="/shipping" className="cta-button secondary">
            Ship Now
          </Link>
        </div>
      </div>
    </section>

    {/* Services Section */}
    <section className="features">
      <h2>Our Services</h2>
      <div className="features-grid">
        {services.map((s, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-image">
              <img 
                src={s.img} 
                alt={s.title} 
                loading="lazy"
              />
            </div>
            <div className="feature-body">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <button className="learn-more">Learn More</button>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* How It Works Section */}
    <section className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps-grid">
        {['Create', 'Track', 'Receive'].map((step, i) => (
          <div key={i} className="step">
            <div className="step-number">{i + 1}</div>
            <h4>{step} Shipment</h4>
            <p>{
              step === 'Create'
                ? 'Fill out our form to start your shipment.'
                : step === 'Track'
                ? 'Follow your package in real time.'
                : 'Receive your delivery safely & on time.'
            }</p>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials Section */}
    <section className="testimonials">
      <h2>What Our Clients Say</h2>
      <div className="testimonial-cards">
        {[ 
          { quote: "FedXpress streamlined our shipping.", name: "Sarah",   company: "Global Retail" },
          { quote: "Amazing delivery times.",               name: "Michael", company: "eCom Edge"   },
          { quote: "Excellent customer support.",           name: "Lina",    company: "MartLogistics" }
        ].map((t, i) => (
          <div key={i} className="testimonial-card">
            <p className="quote">“{t.quote}”</p>
            <p className="name">– {t.name}, <span>{t.company}</span></p>
          </div>
        ))}
      </div>
    </section>

    {/* Partners Section */}
    <section className="partners">
      <h2>Our Trusted Partners</h2>
      <div className="partner-logos-container">
        <div className="partner-logos">
          {partners.map((p, i) => (
            <img 
              key={i} 
              src={p.src} 
              alt={p.alt} 
              className="partner-img"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>

    {/* Final CTA Section */}
    <section className="cta-final">
      <h2>Start Shipping with Confidence</h2>
      <p>Join thousands trusting us every day.</p>
      <Link to="/shipping" className="cta-button primary">
        Create Shipment
      </Link>
    </section>

    {/* Footer Section */}
    <footer className="site-footer">
      <div className="footer-widgets">
        <div className="footer-widget">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shipping">Shipping</Link></li>
            <li><Link to="/tracking">Tracking</Link></li>
            <li><Link to="/support">Support</Link></li>
          </ul>
        </div>
        <div className="footer-widget">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:support@fedxpress.com">support@fedxpress.com</a></li>
            <li><a href="tel:+18001234567">+1 800 123 4567</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} FedXpress. All rights reserved.
      </div>
    </footer>
  </div>
);

export default Home;