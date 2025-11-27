import './simple.css';

export default function SimpleLoader(settings: { width: number; height: number }) {
  return <div className="SimpleLoader" style={settings}></div>;
}
