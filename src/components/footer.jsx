import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-sections">
        <div className="footer-column">
          <h3>COMPANY</h3>
          <ul>
            <li>About Last.fm</li>
            <li>Contact Us</li>
            <li>Jobs</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>HELP</h3>
          <ul>
            <li>Track My Music</li>
            <li>Community Support</li>
            <li>Community Guidelines</li>
            <li>Help</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>GOODIES</h3>
          <ul>
            <li>Download Scrobbler</li>
            <li>Developer API</li>
            <li>Free Music Downloads</li>
            <li>Merchandise</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>ACCOUNT</h3>
          <ul>
            <li>Inbox</li>
            <li>Settings</li>
            <li>Last.fm Pro</li>
            <li>Logout</li>
          </ul>
        </div>
        <div className="footer-column social">
          <h3>FOLLOW US</h3>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;