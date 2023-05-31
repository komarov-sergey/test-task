import {useEffect, useState, useRef, useContext} from 'react'
import {Button} from 'primereact/button'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {InputText} from 'primereact/inputtext'
import {Controller, useForm} from 'react-hook-form'
import {classNames} from 'primereact/utils'
import {Toast} from 'primereact/toast'
import {Password} from 'primereact/password'
import {Checkbox} from 'primereact/checkbox'
import {useJwt} from 'react-jwt'

import {CurrentUserContext} from '../contexts/currentUser'
import useSessionStorage from '../hooks/useSessionStorage'
import s from './App.module.scss'

function App() {
  const [token, setToken] = useSessionStorage('token')
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const defaultAddTaskValues = {
    username: '',
    email: '',
    body: '',
    status: false,
  }
  const defaultLoginValues = {
    email: '',
    password: '',
  }
  const {
    control,
    formState: {errors},
    handleSubmit,
    getValues,
    setValue,
  } = useForm({defaultAddTaskValues})
  const {
    control: controlLogin,
    formState: {errors: errorsLogin},
    handleSubmit: handleSubmitLogin,
    getValues: getValuesLogin,
  } = useForm({defaultLoginValues})
  const [currentUserState, dispatch] = useContext(CurrentUserContext)
  const {decodedToken} = useJwt(token)
  const toast = useRef(null)

  useEffect(() => {
    getAllTasks()
  }, [])

  const show = (severity = 'success', msg) => {
    toast.current.show({
      severity,
      summary: msg,
      detail: getValues('value'),
    })
  }

  const clearForm = () => {
    setValue('username', '')
    setValue('email', '')
    setValue('body', '')
    setValue('status', false)
    setSelectedTask(null)
  }

  const getAllTasks = () => {
    fetch('/api/task')
      .then((response) => {
        return response.ok ? response.json() : Promise.reject(response.json())
      })
      .then((taskData) => {
        setTasks(taskData)
      })
      .catch((err) => {
        err.then((json) => {
          show('error', json.errors.body[0])
        })
      })
  }

  const upsertTask = (data) => {
    if (!selectedTask) {
      fetch('/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({task: getValues()}),
      })
        .then((response) => {
          return response.ok ? response.json() : Promise.reject(response.json())
        })
        .then((taskData) => {
          getAllTasks()
          show('success', 'Task Added')
        })
        .catch((err) => {
          err.then((json) => {
            show('error', json.errors.body[0])
          })
        })
    } else {
      fetch(`/api/task/${selectedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({task: getValues()}),
      })
        .then((response) => {
          return response.ok ? response.json() : Promise.reject(response.json())
        })
        .then((taskData) => {
          getAllTasks()
          show('success', 'Task Updated')
        })
        .catch((err) => {
          err.then((json) => {
            show(
              'error',
              json.code === 'UNAUTHORIZED_ERROR'
                ? 'Session Expired pls relogin'
                : 'Something went wrong'
            )
          })
        })
    }

    clearForm()
  }

  const doLogin = (data) => {
    const formValues = getValuesLogin()

    const reqBody = {
      user: {
        username: formValues.usernameLogin,
        password: formValues.passwordLogin,
      },
    }

    fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        return response.ok ? response.json() : Promise.reject(response.json())
      })
      .then((userData) => {
        getAllTasks()
        show('success', 'Login Success')
        dispatch({type: 'SET_AUTHORIZED', payload: userData})
        setToken(userData.token)
      })
      .catch((err) => {
        err.then((json) => {
          show('error', json.errors.body[0])
        })
      })
  }

  const doLogout = (e) => {
    e.preventDefault()
    const reqBody = {
      user: {
        id: decodedToken.id,
      },
    }

    fetch('/api/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        return response.ok ? response.json() : Promise.reject(response.json())
      })
      .then((userData) => {
        getAllTasks()
        show('success', 'Logout Success')
      })
      .catch((err) => {
        err.then((json) => {
          show('error', json.errors.body[0])
        })
      })
      .finally(() => {
        setToken('')
        clearForm()
        dispatch({type: 'SET_UNAUTHORIZED'})
      })
  }

  const onSelectTask = (e) => {
    if (!currentUserState.isLoggedIn) {
      return
    }

    setSelectedTask(e.value)
    setValue('username', e.value.username)
    setValue('email', e.value.email)
    setValue('body', e.value.body)
    setValue('status', e.value.status)
  }

  const addNewTackClick = (e) => {
    clearForm()
  }

  const getFormErrorMessage = (name, errors) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    )
  }

  return (
    <>
      <header className={s.border}>
        <form onSubmit={handleSubmitLogin(doLogin)}>
          <Controller
            name="usernameLogin"
            control={controlLogin}
            rules={{required: 'Username is required.'}}
            render={({field, fieldState}) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({'p-error': errors.value})}
                ></label>
                <span className="p-float-label">
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames({'p-invalid': fieldState.error})}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Username</label>
                </span>
                {getFormErrorMessage(field.name, errorsLogin)}
              </div>
            )}
          />
          <Controller
            name="passwordLogin"
            control={controlLogin}
            rules={{required: 'Password is required.'}}
            render={({field, fieldState}) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({'p-error': errors.value})}
                ></label>
                <span className="p-float-label">
                  <Password
                    id={field.name}
                    value={field.value}
                    className={classNames({'p-invalid': fieldState.error})}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Password</label>
                </span>
                {getFormErrorMessage(field.name, errorsLogin)}
              </div>
            )}
          />
          {!currentUserState.isLoggedIn && <Button type="submit">Login</Button>}
          {currentUserState.isLoggedIn && (
            <Button onClick={doLogout}>Logout</Button>
          )}
        </form>
      </header>
      <main>
        <Button onClick={addNewTackClick}>Add new Tasks</Button>
        <form onSubmit={handleSubmit(upsertTask)}>
          <Controller
            name="username"
            control={control}
            rules={{required: 'Username is required.'}}
            render={({field, fieldState}) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({'p-error': errors.value})}
                ></label>
                <span className="p-float-label">
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames({'p-invalid': fieldState.error})}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Username</label>
                </span>
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({field, fieldState}) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({'p-error': errors.value})}
                ></label>
                <span className="p-float-label">
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames({'p-invalid': fieldState.error})}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Email</label>
                </span>
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
          <Controller
            name="body"
            control={control}
            rules={{required: 'Body is required.'}}
            render={({field, fieldState}) => (
              <div>
                <label
                  htmlFor={field.name}
                  className={classNames({'p-error': errors.value})}
                ></label>
                <span className="p-float-label">
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames({'p-invalid': fieldState.error})}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={field.name}>Body</label>
                </span>
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({field, fieldState}) => (
              <div className={s.checkbox}>
                <Checkbox
                  id={field.name}
                  className={classNames({'p-invalid': fieldState.error})}
                  inputRef={field.ref}
                  checked={field.value}
                  onChange={(e) => field.onChange(!field.value)}
                />
              </div>
            )}
          />

          <Button type="submit" icon="pi pi-check" />
        </form>
        {tasks[0] && (
          <DataTable
            value={tasks[0]}
            tableStyle={{width: '70rem'}}
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
            <Column field="status" sortable header="done"></Column>
            <Column field="updated" sortable header="updated by admin"></Column>
          </DataTable>
        )}
      </main>
      <Toast ref={toast} position="bottom-right" />
    </>
  )
}

export default App
