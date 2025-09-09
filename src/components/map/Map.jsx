// components/MapEmbed.js
import React from 'react';
import './Map.css';  

const Map = () => {
  return (
    <div className="map-container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d705.1202610125737!2d-48.43599302764065!3d-1.3181244718936882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1spt-PT!2sbr!4v1730727403297!5m2!1spt-PT!2sbr"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
