import React, { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { toast } from "react-toastify"


const App = () => {
  const [loading, setLoading] = useState(false);
  const [serverStarted, setServerStarted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    numIterations: 1
  })

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true)
    const { email, password } = formData;
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/run-script`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    const result = await res.json()
    if (result?.message === 'Script executed successfully.') {
      toast.success(result.message)
      setLoading(false)
    }
    else {
      toast.error('Bot not started. Please try again later.')
    }
  }

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const startServer = async () => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    const result = await res.json()
    if (result?.message === 'Server started successfully.') {
      setServerStarted(true)
    }
    else {
      toast.error('Server not started. Please try again later.')
    }
  }

  useEffect(() => {
    startServer()
  }, [])

  return (

    <>
      <h1 className='font-semibold w-full text-center h-fit text-2xl'>FB TAG BOT</h1>
      <hr />

      {
        !serverStarted ? <div className='flex flex-col justify-start items-center w-full h-full gap-4 mt-24'>
          <RotatingLines height="50" width="50" strokeColor='blue' />
          <p className='w-full text-blue-500 font-semibold text-wrap text-center px-4'>Server is being initialized. It might take 5 minutes if started after 15 minutes of use.</p> </div> :
          <form className='w-[100vw] flex flex-col justify-start items-center gap-4 mt-4'>

            <div className='w-full px-1 flex justify-between align-center gap-3 mt-3 px-2'>
              <label htmlFor="email"
                className='w-fit py-1 font-semibold text-xl'>Email: </label>
              <input type="email"
                required
                readOnly={loading}
                placeholder='example@email.com'
                value={formData.email}
                name='email'
                onChange={handleChange}
                className='w-fit h-fit border px-2 py-1 font-normal text-xl rounded shadow outline-none' />
            </div>

            <div className='w-full px-1 flex justify-between align-center gap-3 mt-3 px-2'>
              <label htmlFor="email"
                className='w-fit py-1 font-semibold text-xl'>Password: </label>
              <input type="password"
                required
                readOnly={loading}
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='**password**'
                className='w-fit h-fit border px-2 py-1 font-normal text-xl rounded shadow outline-none' />
            </div>

            <div className='w-full px-1 flex justify-between align-center gap-3 mt-3 px-2'>
              <label htmlFor="email"
                className='w-fit py-1 font-semibold text-xl'>Iterations: </label>
              <input type="number"
                required
                readOnly
                name='numIterations'
                value={formData.numIterations}
                onChange={handleChange}
                placeholder='Bot run count'
                className='w-fit h-fit border px-2 py-1 font-normal text-xl rounded shadow outline-none' />
            </div>

            <button className='mt-5 bg-black text-white text-lg py-1 px-4 rounded active:bg-slate-600 w-[40%] h-10 flex justify-center items-center' type='submit' onClick={!loading ? handleSubmit : e => { e.preventDefault(); toast.info('Bot is already running.') }} >
              {!loading ? "START BOT" : <RotatingLines height="30" width="30" strokeColor='white' />}
            </button>
            {
              loading &&
              <p className='w-full text-red-500 font-semibold text-wrap text-center px-4'>
                Bot is started don't close the browser or change the tab. Stay here else bot will crash.
              </p>
            }

          </form>}

    </>
  )
}

export default App