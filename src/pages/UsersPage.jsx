import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import UserForm from "../components/users/UserForm";
import UsersTable from "../components/users/UsersTable";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      setErrorMessage("");

      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "No fue posible cargar los usuarios.";
      setErrorMessage(backendMessage);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
      } else {
        await createUser(formData);
      }

      setSelectedUser(null);
      await loadUsers();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "No fue posible guardar el usuario.";
      setErrorMessage(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
    setErrorMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmed) return;

    try {
      setErrorMessage("");
      await deleteUser(id);

      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }

      await loadUsers();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "No fue posible eliminar el usuario.";
      setErrorMessage(backendMessage);
    }
  };

  return (
    <AppLayout title="Usuarios">
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            {selectedUser ? "Editar usuario" : "Crear usuario"}
          </h2>

          <UserForm
            onSubmit={handleCreateOrUpdate}
            initialValues={selectedUser}
            isEditing={!!selectedUser}
            onCancel={handleCancelEdit}
            isLoading={isSubmitting}
          />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Lista de usuarios
            </h2>
            <p className="text-sm text-slate-500">
              Gestiona los usuarios registrados en la aplicación.
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {isLoadingUsers ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
              Cargando usuarios...
            </div>
          ) : (
            <UsersTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>
    </AppLayout>
  );
}

export default UsersPage;