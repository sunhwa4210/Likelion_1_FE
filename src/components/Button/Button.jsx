import './Button.css';

export default function Button({ label, onClick, type = 'button' }) {
  return (
    <button className="btn" type={type} onClick={onClick}>
      {label}
    </button>
  );
}
