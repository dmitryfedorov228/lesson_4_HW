
import React, {useState, useEffect, Fragment, useCallback} from "react";
import axios from "axios";

const API_URL = 'http://localhost:3500'

function App() {

    const [todos, setTodos] = useState([])
    const [value, setValue] = useState('')

    const [loader, setLoader] = useState(true);

    useEffect(()=> {
      setTimeout(() => {
        setLoader(!loader)
      }, 2000)
    }, [])

  const getTodosRequest = async () => {
    try{
      const { data } = await axios(`${API_URL}/todos`)
    setTodos(data)
    } catch(error) {
      console.log('error:', error);
    }
    
  }

  const handleClick = useCallback (async () => {

    

    const newTodo = {
      title: value,
      isCompleted: false,
      
      
    }
   const {data} = await axios.post(`${API_URL}/todos`, newTodo ) 
    setTodos(prevTodos => [...prevTodos, data ])
    setValue('')
  }, [value])
  
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const deleteTodoRequest = async (todo) => {
    try {
       await axios.delete(`${API_URL}/todos/${todo.id}`)
      setTodos(prevTodos => {
        return prevTodos.filter(prevTodo => {
          return prevTodo.id !== todo.id 
        })
      })
    } catch (error) {
      console.log('error:', error);
    }
  }

  const completeTodoRequest = async (todo) => {
        try {
          const {data} = await axios.patch(`${API_URL}/todos/${todo.id}`, {isCompleted : !todo.isCompleted})
          setTodos(prevTodos => {
            return prevTodos.map(prevTodo => {
              return prevTodo.id === todo.id ? data : prevTodo
            })
          })
        } catch (error) {
          console.log('error:', error);
        }
      }

      
    
       useEffect(() => {
    getTodosRequest()
  }, [])

  useEffect(() => {
    console.log(todos);
  }, [todos])

  return (
    <div className="App">

      {/* <Loader  /> */}

      {loader?<div>Loading...</div>:
      <>
      <div>
        <h2>{`Общее кол-во: ${todos.length}`}</h2>
        <h3>{`Кол-во выполненных: ${todos.filter(todo => todo.isCompleted).length}`}</h3>
        <h1>Todo app</h1>
        <input 
          onChange={handleChange}
          value={value}
        />
        <button onClick={ handleClick}>добавить</button>
      </div>

      {
         todos?.length ? (
                    <ul>
                      {todos.map(todo => (
                        <li key={todo.id}>
                          <span>{todo.title}</span>
                          <input 
                          onChange={() => completeTodoRequest(todo)}
                          checked={todo.isCompleted}
                          type="checkbox"/> 
                          <button onClick={() => deleteTodoRequest(todo)}>удалить</button>
                          
                        </li>
                        
                      ))}
                    </ul>
                  ) : <Fragment />
                }

      </>
      }
    </div>
  );
}

export default App;



