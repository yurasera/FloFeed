import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ padding: '1rem', background: '#222', color: '#fff' }}>
    <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0 }}>
      <li><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
      <li><Link to="/feedback" style={{ color: '#fff', textDecoration: 'none' }}>Feedback</Link></li>
    </ul>
  </nav>
);

export default Navbar;
