import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, Navigate } from 'react-router-dom';
import { Context, server } from '../main';
import { Button } from '../components/ui/button';
import bgImg from '../assets/national-institute-of-technology-jamshedpur-242023.jpg';


const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { email, password } = formData;
      const { data } = await axios.post(
        `${server}/users/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.response.data.message);

      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated) return <Navigate to={"/dashboard"} replace />;

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-10 bg-gradient-to-br from-indigo-50 via-white to-slate-50">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 bg-card shadow-lg border rounded-lg overflow-hidden">
        <div className="p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/7/7d/National_Institute_of_Technology%2C_Jamshedpur_Logo.png"
              className="h-12 w-auto"
              alt="NITJSR Logo"
            />
            <Link to="/register" className="text-sm font-medium text-primary hover:underline">
              Not registered yet? Register Now!!
            </Link>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-semibold tracking-tight">NIT Jamshedpur CP Portal</h1>
            <p className="text-muted-foreground text-sm max-w-sm">Welcome back! Please login to your account.</p>
          </div>
          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <Button type="submit" className="w-full">Log In</Button>
          </form>
        </div>
        <div className="relative hidden md:block">
          <img src={bgImg} alt="Campus" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
        </div>
      </div>
    </div>
  )
}

export default Login;
