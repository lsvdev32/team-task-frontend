import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-700 hover:bg-slate-200"
    }`;

  return (
    <aside className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Team Task</h2>
        <p className="text-sm text-slate-500">Panel de gestión</p>
      </div>

      <nav className="space-y-2">
        <NavLink to="/users" className={linkClass}>
          Usuarios
        </NavLink>
        <NavLink to="/tasks" className={linkClass}>
          Tareas
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className="mt-6 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-500"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;