import { CSSProperties } from 'react';

export const SPINNER_KEYFRAMES = `
@keyframes ocrModalSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`;

interface ConfirmModalStyles {
  dialog: CSSProperties;
  spinner: CSSProperties;
  image: CSSProperties;
  text: CSSProperties;
  input: CSSProperties;
  errorMessage: CSSProperties;
  buttons: CSSProperties;
  button: CSSProperties;
}

export const styles: ConfirmModalStyles = {
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: '24px 28px',
    maxWidth: 420,
    width: '90vw',
  },
  spinner: {
    width: 28,
    height: 28,
    border: '3px solid rgba(255,255,255,0.15)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'ocrModalSpin 0.8s linear infinite',
  },
  image: {
    width: '100%',
    borderRadius: 8,
    objectFit: 'contain',
    maxHeight: 180,
    background: '#000',
  },
  text: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 4,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    background: '#2a2a2a',
    border: '1.5px solid #444',
    borderRadius: 8,
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 4,
    textAlign: 'center',
    padding: '10px 12px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  errorMessage: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  buttons: {
    display: 'flex',
    gap: 16,
    width: '100%',
  },
  button: {
    flex: 1,
  },
};
