import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import s from "./App.module.scss";

function App() {
  const [tasks, setTasks] = useState([]);

  console.log(s);

  useEffect(() => {
    fetch("/api/task")
      .then((response) => {
        return response.json();
      })
      .then((taskData) => {
        setTasks(taskData);
      });
    console.log("useEffect!");
  }, []);

  return (
    <>
      <header>
        <Button>Login</Button>
      </header>
      <main>
        <Button>Add new Tasks</Button>
        {tasks[0] && (
          <DataTable
            value={tasks[0]}
            tableStyle={{ minWidth: "60rem" }}
            paginator
            rows={3}
          >
            <Column field="username" header="username"></Column>
            <Column field="email" header="email"></Column>
            <Column field="body" header="body"></Column>
            <Column field="status" header="status"></Column>
            {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
            {/* <Column field="category" header="Category"></Column> */}
            {/* <Column header="Status" body={statusBodyTemplate}></Column> */}
          </DataTable>
        )}
      </main>
    </>
  );
}

export default App;
