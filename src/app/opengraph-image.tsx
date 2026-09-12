import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export const alt = 'Bitnexel — High-Performance Software & Systems Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #08090E 0%, #14142E 55%, #22104A 100%)',
          color: '#F1F1F6',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '9999px',
              background: '#8B7FFF',
            }}
          />
          <div style={{ fontSize: '26px', color: '#00D4FF', letterSpacing: '0.35em' }}>
            BITNEXEL
          </div>
        </div>
        <div
          style={{
            marginTop: '44px',
            fontSize: '70px',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          High-Performance
        </div>
        <div style={{ fontSize: '70px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Software & Systems
        </div>
        <div
          style={{
            marginTop: '30px',
            fontSize: '27px',
            color: 'rgba(241,241,246,0.72)',
          }}
        >
          Digital flagships · Custom software · Web apps & SaaS
        </div>
        <div
          style={{
            marginTop: '60px',
            fontSize: '21px',
            color: 'rgba(241,241,246,0.5)',
            letterSpacing: '0.12em',
          }}
        >
          bitnexel.in
        </div>
      </div>
    ),
    { ...size },
  );
}
