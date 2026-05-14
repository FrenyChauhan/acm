import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <NavLink to="/" className="nav-logo">
            <div className="nav-diamond" style={{ width: '32px', height: '32px' }}>
              <div className="nav-diamond-inner" style={{ width: '22px', height: '22px' }}>
                <span>acm</span>
              </div>
            </div>
            <div className="nav-name" style={{ fontSize: '.95rem' }}>
              ACM NIT Surat<small>Student Chapter</small>
            </div>
          </NavLink>
          <p className="footer-tagline">
            A student chapter highly focused on planning and organising events for coding, development, and design — at SVNIT, Surat.
          </p>
          <div className="footer-socials">
            <a href="https://github.com/acm-svnit" className="footer-social" target="_blank" rel="noreferrer">gh</a>
            <a href="https://linkedin.com/company/acmnitsurat" className="footer-social" target="_blank" rel="noreferrer">in</a>
            <a href="https://twitter.com/acmnitsurat" className="footer-social" target="_blank" rel="noreferrer">tw</a>
            <a href="https://facebook.com/acmnitsurat" className="footer-social" target="_blank" rel="noreferrer">fb</a>
            <a href="https://youtube.com/c/acmnitsurat" className="footer-social" target="_blank" rel="noreferrer">yt</a>
          </div>
        </div>
        <div className="footer-col">
          <h5>Quick Links</h5>
          <ul className="footer-links">
            <li><NavLink to="/blogs">Blog</NavLink></li>
            <li><NavLink to="/events">Events</NavLink></li>
            <li><NavLink to="/projects">Projects</NavLink></li>
            <li><NavLink to="/team">Team</NavLink></li>
            <li><NavLink to="/achievements">Achievements</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <ul className="footer-links">
            <li><a href="tel:+917977579577">+91 79775 79577</a></li>
            <li><a href="mailto:acm@svnit.ac.in">acm@svnit.ac.in</a></li>
            <li><a href="#">SVNIT, Ichchhanath, Surat 395 007</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 ACM NIT Surat · All rights reserved</span>
        <span className="footer-heart">Made with <span>♥</span> by ACM NIT Surat</span>
      </div>
    </footer>
  );
}
