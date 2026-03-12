import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskForm from "../components/tasks/TaskForm";
import TasksTable from "../components/tasks/TasksTable";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskService";
import { getUsers } from "../services/userService";

const initialFilters = {
  search: "",
  status: "",
  priority: "",
  userId: "",
};

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
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

  const loadTasks = async (customFilters = filters) => {
    try {
      setIsLoadingTasks(true);
      setErrorMessage("");

      const data = await getTasks(customFilters);
      setTasks(data);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "No fue posible cargar las tareas.";
      setErrorMessage(backendMessage);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadTasks(filters);
  }, [filters]);

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (selectedTask) {
        await updateTask(selectedTask.id, formData);
      } else {
        await createTask(formData);
      }

      setSelectedTask(null);
      await loadTasks();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "No fue posible guardar la tarea.";
      setErrorMessage(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    setSelectedTask(null);
    setErrorMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar esta tarea?");
    if (!confirmed) return;

    try {
      setErrorMessage("");
      await deleteTask(id);

      if (selectedTask?.id === id) {
        setSelectedTask(null);
      }

      await loadTasks();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "No fue posible eliminar la tarea.";
      setErrorMessage(backendMessage);
    }
  };

  return (
    <AppLayout title="Tareas">
      <div className="space-y-6">
        <TaskFilters
          filters={filters}
          users={users}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              {selectedTask ? "Editar tarea" : "Crear tarea"}
            </h2>

            {isLoadingUsers ? (
              <p className="text-sm text-slate-500">Cargando usuarios...</p>
            ) : (
              <TaskForm
                onSubmit={handleCreateOrUpdate}
                initialValues={selectedTask}
                users={users}
                isEditing={!!selectedTask}
                onCancel={handleCancelEdit}
                isLoading={isSubmitting}
              />
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Lista de tareas
              </h2>
              <p className="text-sm text-slate-500">
                Gestiona tareas, filtros y búsqueda en tiempo real.
              </p>
            </div>

            {isLoadingTasks ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
                Cargando tareas...
              </div>
            ) : (
              <TasksTable
                tasks={tasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

export default TasksPage;