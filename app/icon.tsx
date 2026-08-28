import { ImageResponse } from 'next/og';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: '#142c3a',
        color: '#d2b27a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        fontSize: 30,
        fontFamily: 'serif',
      }}
    >
      LH
    </div>,
    size,
  );
}
