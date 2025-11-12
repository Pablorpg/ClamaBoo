import './style.css'
import LogoClamaBoo from "../../assets/ClamaBooLogo.png";

export default function Dashboard() {
  return (
    <div className='dashboard-body'>
      <header className="navbar">
        <div className="logo">
          <img className="logoClamaBoo" src={LogoClamaBoo} alt="Logo" />
        </div>

        <nav>
          <ul>
            <li className="active">DashBoard</li>
            <li>Doações</li>
            <li>Denúncias</li>
            <li>Perfil</li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
