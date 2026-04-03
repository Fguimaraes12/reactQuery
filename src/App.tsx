import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./main";

type User = {
  id: number;
  name: string;
  username: string;
};

async function fetchUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
}

function App() {
  const users = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: DeleteUser,
    onSuccess: (id) => {
      queryClient.setQueryData(["users"], (oldData: User[]) => {
        return oldData?.filter((user) => user.id !== id);
      });
    },
  });

  async function DeleteUser(id: number) {
    return id;
  }

  if (users.isLoading) return <p>Carregando...</p>;
  if (users.error) return <p>error...</p>;

  console.log(users.data);

  return (
    <div>
      <button onClick={() => mutation.mutate(10)}>Editar usuario</button>
      <ul>
        {users.data?.map((user) => (
          <li key={user.id}>
            <h1>{user.name}</h1>
            <p>{user.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
