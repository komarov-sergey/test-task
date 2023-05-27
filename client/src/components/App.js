import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";

import s from "./App.module.scss";

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const defaultAddTaskValues = {
    username: "",
    email: "",
    body: "",
    status: "",
  };
  const defaultLoginValues = {
    email: "",
    password: "",
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = useForm({ defaultAddTaskValues });
  const {
    control: controlLogin,
    formState: { errors: errorsLogin },
    handleSubmit: handleSubmitLogin,
    getValues: getValuesLogin,
    reset: resetLogin,
  } = useForm({ defaultLoginValues });

  const toast = useRef(null);

  const show = (msg) => {
    toast.current.show({
      severity: "success",
      summary: msg,
      detail: getValues("value"),
    });
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const getAllTasks = () => {
    fetch("/api/task")
      .then((response) => {
        return response.json();
      })
      .then((taskData) => {
        setTasks(taskData);
      });
  };

  const upsertTask = (data) => {
    console.log(getValues());

    if (!selectedTask) {
      fetch("/api/task", {
        method: "POST",
        body: JSON.stringify({ task: getValues() }),
      })
        .then((response) => {
          return response.json();
        })
        .then((taskData) => {
          getAllTasks();
          show("Task Added");
        });
    } else {
      fetch(`/api/task/${selectedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJTZXJnZXkiLCJleHAiOjE2OTAzNjk0ODMsImlhdCI6MTY4NTE4NTQ4M30.yLoU9CZ9cMtaZ4WF0Suv2vmDTn7BR-rK7lvLHdcnHp8",
        },
        body: JSON.stringify({ task: getValues() }),
      })
        .then((response) => {
          return response.json();
        })
        .then((taskData) => {
          getAllTasks();
          show("Task Updated");
        });
    }
  };

  const doLogin = (data) => {
    console.log(getValuesLogin());

    const formValues = getValuesLogin();

    const reqBody = {
      user: {
        username: formValues.usernameLogin,
        password: formValues.passwordLogin,
      },
    };

    fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        return response.json();
      })
      .then((taskData) => {
        getAllTasks();
        show("Login Success");
      });
  };

  const doLogout = (e) => {
    e.preventDefault();

    console.log("Logout");
  };

  const onSelectTask = (e) => {
    console.log(e.value);
    setSelectedTask(e.value);

    setValue("username", e.value.username);
    setValue("email", e.value.email);
    setValue("body", e.value.body);
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const getFormErrorMessageLogin = (name) => {
    return errorsLogin[name] ? (
      <small className="p-error">{errorsLogin[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <>
      <header>
        <form onSubmit={handleSubmitLogin(doLogin)}>
          <Controller
            name="usernameLogin"
            control={controlLogin}
            rules={{ required: "Username is required." }}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({ "p-error": errors.value })}
                ></label>
                <span className="p-float-label">
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames({ "p-invalid": fieldState.error })}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Username</label>
                </span>
                {getFormErrorMessageLogin(field.name)}
              </div>
            )}
          />
          <Controller
            name="passwordLogin"
            control={controlLogin}
            rules={{ required: "Password is required." }}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({ "p-error": errors.value })}
                ></label>
                <span className="p-float-label">
                  <Password
                    id={field.name}
                    value={field.value}
                    className={classNames({ "p-invalid": fieldState.error })}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Password</label>
                </span>
                {getFormErrorMessageLogin(field.name)}
              </div>
            )}
          />
          <Button type="submit">Login</Button>
          <Button onClick={doLogout}>Logout</Button>
        </form>
      </header>
      <main>
        <Button>Add new Tasks</Button>
        <form onSubmit={handleSubmit(upsertTask)}>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Username is required." }}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({ "p-error": errors.value })}
                ></label>
                <span className="p-float-label">
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames({ "p-invalid": fieldState.error })}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Username</label>
                </span>
                {getFormErrorMessage(field.name)}
              </div>
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({ "p-error": errors.value })}
                ></label>
                <span className="p-float-label">
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames({ "p-invalid": fieldState.error })}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Email</label>
                </span>
                {getFormErrorMessage(field.name)}
              </div>
            )}
          />
          <Controller
            name="body"
            control={control}
            rules={{ required: "Body is required." }}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({ "p-error": errors.value })}
                ></label>
                <span className="p-float-label">
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames({ "p-invalid": fieldState.error })}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Body</label>
                </span>
                {getFormErrorMessage(field.name)}
              </div>
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({ "p-error": errors.value })}
                ></label>
                <span className="p-float-label">
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames({ "p-invalid": fieldState.error })}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Status</label>
                </span>
                {getFormErrorMessage(field.name)}
              </div>
            )}
          />

          <Button type="submit" icon="pi pi-check" />
        </form>
        {tasks[0] && (
          <DataTable
            value={tasks[0]}
            tableStyle={{ width: "70rem" }}
            selectionMode="single"
            selection={selectedTask}
            onSelectionChange={onSelectTask}
            paginator
            editMode="cell"
            rows={3}
          >
            <Column field="username" sortable header="username"></Column>
            <Column field="email" sortable header="email"></Column>
            <Column field="body" sortable header="body"></Column>
            <Column field="status" sortable header="status"></Column>
            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
          </DataTable>
        )}
      </main>
      <Toast ref={toast} position="bottom-right" />
    </>
  );
}

export default App;
