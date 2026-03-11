import Sidebar from "./Sidebar";

function AppLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 lg:flex-row">
        <Sidebar />

        <main className="flex-1 rounded-2xl bg-white p-6 shadow-sm">
          <header className="mb-6 border-b border-slate-200 pb-4">
            <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;