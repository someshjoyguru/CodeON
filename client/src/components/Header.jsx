import axios from 'axios';
import React, { useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Context, server } from '../main';
import { Button } from '../components/ui/button';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, user } = useContext(Context);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/users/logout`, {
        withCredentials: true,
      });

      toast.success("Logged Out Successfully");
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(true);
    }
  };

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <div onClick={()=>navigate('/')} className="font-extrabold text-lg cursor-pointer select-none tracking-tight">
          Code<span className="text-primary">ON</span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2 ml-auto">
          <Button variant="ghost" size="sm" onClick={()=>navigate('/')}>Home</Button>
          {isAuthenticated && <Button variant="ghost" size="sm" onClick={()=>navigate('/dashboard')}>Dashboard</Button>}
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={logoutHandler}>Logout</Button>
          ) : (
            <Button variant="outline" size="sm" onClick={()=>navigate('/login')}>Login</Button>
          )}
          <DarkModeToggle />
          {isAuthenticated && user?.image?.url ? (
            <img src={user.image.url} alt="Profile" className="h-8 w-8 rounded-full border" />
          ) : null}
        </nav>
      </div>
    </header>
  )
};

export default Header;
