import logo from './logo.svg';
import './App.css';

import React, {useEffect, useState} from 'react'
import MaterialTable from 'material-table'
import axios from 'axios'

const backend = axios.create({
  baseURL: "http://127.0.0.1:3001/api"
})

const items = [
  ]

function App() {

  const rowAdd = (newRow, resolve) => {
    let errors = []
    if (newRow.name === "") {
      errors.push("no name")
    }
    if (newRow.surname === "") {
      errors.push("no surname")
    }
    if (newRow.valid_to === "") {
      errors.push("no valid_to")
    }
    if (errors.length > 0) {
      setErrorMessages(errors)
      setIsError(true)
      resolve()
    }
    backend.post("/items", newRow)
        .then(response => {
          let newData = [...data]
          newData.push(response.data)
          setData(newData)
          resolve()
          setErrorMessages([])
          setIsError(false)
        })
        .catch(error => {
          setErrorMessages(["server error"])
          setIsError(true)
          resolve()
        })
  }


  const rowUpdate = (newRow, oldRow, resolve) => {
    let errors = []
    if (newRow.name === "") {
      errors.push("no name")
    }
    if (newRow.surname === "") {
      errors.push("no surname")
    }
    if (newRow.valid_to === "") {
      errors.push("no valid_to")
    }
    if (errors.length > 0) {
      setErrorMessages(errors)
      setIsError(true)
      resolve()
    }
    backend.put(`/items/${oldRow.ext_id}`, newRow)
        .then(response => {
          let newData = [...data]
          const index = oldRow.tableData.id
          newData[index] = newRow
          setData(newData)
          resolve()
          setErrorMessages([])
          setIsError(false)
        })
        .catch(error => {
          setErrorMessages(["server error"])
          setIsError(true)
          resolve()
        })
  }

  const rowDelete = (oldRow, resolve) => {
    backend.delete(`/items/${oldRow.ext_id}`)
      .then(() => {
        const newData = [...data]
        const index = oldRow.tableData.id
        newData.splice(index, 1)
        setData([...newData])
        resolve()
      })
      .catch(error => {
        setErrorMessages(["server error"])
        setIsError(true)
        resolve()
      })
  }

  const [data, setData] = useState(items)
  const [isError, setIsError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const columns = [
    { title: "Imię", field: "name" },
    { title: "Nazwisko", field: "surname" },
    { title: "Data dodania", field: "created_at", type: "date", editable:false },
    { title: "Data ważności", field: "valid_to", type: "date" }
    ]

  useEffect(() => {
    backend.get("/items")
      .then(res => {
        setData(res.data)
      })
  }, [])
  return (
    <div className="Apka">
      <h1 align="center">Apka</h1>
      <h4 align="center">tabela</h4>
      <MaterialTable
        title="Items"
        data={data}
        columns={columns}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              rowUpdate(newData, oldData, resolve);
            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              rowAdd(newData, resolve)
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              rowDelete(oldData, resolve)
            }),
        }}
      />

    </div>

  );
}

export default App;
