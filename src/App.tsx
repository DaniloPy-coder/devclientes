import { useEffect, useState, useRef } from "react"
import { FiTrash } from "react-icons/fi"
import { api } from "./services/api"
import { toast, ToastContainer } from 'react-toastify'

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at: string;
}

export default function App() {
  const [customers, setCustomers] = useState<CustomerProps[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (err) {
      toast.error("Erro ao carregar clientes.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nameRef.current?.value || !emailRef.current?.value) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      const response = await api.post("/customer", {
        name: nameRef.current.value,
        email: emailRef.current.value,
      });

      setCustomers((allCustomers) => [...allCustomers, response.data]);

      toast.success("Cliente cadastrado com sucesso!");

      nameRef.current.value = "";
      emailRef.current.value = "";

      loadCustomers();
    } catch (err) {
      toast.error("Erro ao cadastrar cliente.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/customer/${id}`);
      toast.success("Cliente deletado com sucesso!");
      loadCustomers();
    } catch (err) {
      toast.error("Erro ao deletar cliente.");
    }
  }


  return (
    <div className="px-4 w-full flex justify-center min-h-screen bg-gray-900">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white">Clientes</h1>

        <form onSubmit={handleSubmit} className="flex flex-col my-6">
          <label className="font-medium text-white">Nome:</label>
          <input
            type="text"
            placeholder="Digite seu nome completo..."
            className="w-full mb-5 p-2 rounded bg-gray-100"
            ref={nameRef}
          />

          <label className="font-medium text-white">Email:</label>
          <input
            type="email"
            placeholder="Digite seu email..."
            className="w-full mb-5 p-2 rounded bg-gray-100"
            ref={emailRef}
          />

          <input
            type="submit"
            value="Cadastrar"
            className="w-full cursor-pointer rounded bg-green-500 p-2 font-medium"
          />
        </form>

        <section className="flex flex-col gap-2">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="duration-300 hover:scale-105 relative w-full rounded bg-white p-2"
            >
              <p><span className="font-medium">Nome:</span> {customer.name}</p>
              <p><span className="font-medium">Email:</span> {customer.email}</p>
              <p><span className="font-medium">Status:</span> {customer.status ? "ATIVO" : "INATIVO"}</p>

              <button onClick={() => handleDelete(customer.id)} className="cursor-pointer -top-2 right-0 bg-red-500 w-7 h-7 absolute flex items-center rounded-lg justify-center">
                <FiTrash size={18} color="#fff" />
              </button>
            </article>
          ))}
        </section>
      </main>

      <ToastContainer theme="colored" autoClose={3000} />
    </div>
  )
}
