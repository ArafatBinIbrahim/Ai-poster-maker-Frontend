import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#006a4e', // Bangladesh flag green
          borderRadius: '50%',
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            backgroundColor: '#f42a41', // Bangladesh flag red circle
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}