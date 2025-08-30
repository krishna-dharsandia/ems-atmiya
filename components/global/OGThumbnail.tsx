import React from 'react';

interface OGThumbnailProps {
  title?: string;
  subtitle?: string;
  type?: 'default' | 'event' | 'hackathon';
}

const OGThumbnail: React.FC<OGThumbnailProps> = ({ 
  title = "Event Management System", 
  subtitle = "Atmiya University",
  type = 'default'
}) => {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
        }}
      />
      
      {/* Logo/Icon */}
      <div
        style={{
          width: '120px',
          height: '120px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </svg>
      </div>

      {/* Main Title */}
      <h1
        style={{
          fontSize: '64px',
          fontWeight: '700',
          color: 'white',
          margin: '0 0 20px 0',
          textAlign: 'center',
          lineHeight: '1.1',
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: '32px',
          fontWeight: '400',
          color: 'rgba(255, 255, 255, 0.9)',
          margin: '0 0 40px 0',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        {subtitle}
      </p>

      {/* Type Badge */}
      {type !== 'default' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '50px',
            fontSize: '20px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          {type === 'event' ? 'Event' : 'Hackathon'}
        </div>
      )}

      {/* Bottom Branding */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '60px',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '16px 24px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <span
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
          }}
        >
          EMS Platform
        </span>
      </div>
    </div>
  );
};

export default OGThumbnail;
