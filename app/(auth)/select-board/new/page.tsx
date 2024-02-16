'use client'

import React, { useState } from "react"

const NewKanbanPage = () => {

  const [formData, setFormData] = useState({
    name: "",
  })

  const [formSuccess, setFormSuccess] = useState(false)
  const [formSuccessMessage, setFormSuccessMessage] = useState("")

  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }))
  }

  const submitForm = async (e) => {
    // await axios.post()
    // We don't want the page to refresh
    e.preventDefault()

    const data = new FormData()

    // Turn our formData state into data we can use with a form submission
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    })

    // POST the data to the URL of the form
    try {
      let response = await fetch("/api/board/new", {
        method: "POST",
        body: data,
        headers: {
          'accept': 'application/json',
        },
      })
      const dataa = await response.json()
      if (dataa.status == false) {
        setFormSuccessMessage("Failed to create as user does not exist")
      } else {
        setFormSuccessMessage("Successfully created")
        window.location.href = "http://localhost:3000/board/" + dataa.kanban.id;
      }
      setFormSuccess(true)
      
    } catch (error) {
      console.log("-fetch error-------------")
      console.error(error) //statement 2
      console.log("====================")
    }
  }

  return (
    <main className="inline-flex items-center justify-center w-full h-screen">
      {formSuccess ?
        <div>{formSuccessMessage}</div>
        :

        <form method="POST" onSubmit={submitForm}>
          <div className="px-6 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-700">
            <h5 className="items-center justify-center w-full mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create board
            </h5>
            <p className="items-center justify-center w-full mb-3 font-normal text-gray-700 dark:text-gray-400">
              to view...
            </p>

            <div>
              <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
              <input type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                onChange={handleInput}
                name="name"
                value={formData.name}
                required />
            </div>

            <div className="flex gap-3 max-w-sm">
              <button className="py-2.5 px-6 rounded-lg text-sm font-medium bg-teal-200 text-teal-800">Cancel</button>
              <button type="submit" className="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-teal-600">Confirm</button>
            </div>

            <input type="hidden" value="" />
          </div>
        </form>
      }
    </main>
  )
}

export default NewKanbanPage;
