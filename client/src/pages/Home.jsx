import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import useScreenSize from "../utils/useScreenSize.jsx";
import {quotes} from "../assets/quotes.jsx";
import Quote from "../components/Quote.jsx";
import ProtectedRoute from "../utils/ProtectedRoute";

const Home = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState([]);
  const [imageError, setImageError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedRegistrationNo, setEditedRegistrationNo] = useState("");
  const [editedShirtSize, setEditedShirtSize] = useState("");
  const [editedCodeforces, setEditedCodeforces] = useState("");
  const [editedRating, setEditedRating] = useState("0");

  const [imageUri, setImageUri] = useState("");

  const { width } = useScreenSize();
  const isMobile = width < 640;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${server}/users/me`, { withCredentials: true })
      .then((res) => {
        setEditedName(res.data.user.name);
        setEditedEmail(res.data.user.email);
        setEditedPhone(res.data.user.phone);
        setEditedRegistrationNo(res.data.user.registrationNo);
        setEditedShirtSize(res.data.user.shirtSize);
        setEditedCodeforces(res.data.user.codeforces);
        setEditedRating(res.data.user.codeforcesRating);
        if (res.data.user.image) setImageUri(res.data.user.image.url);
      })
      .catch((e) => {
        console.error(e);
        toast.error(e.response?.data?.message || 'Failed to load user');
      })
      .finally(() => setLoading(false));

    const index = Math.floor(Math.random() * quotes.length);
    let author = quotes[index].author;
    author = author ? author.split(", ")[0] : "Unknown";
    setQuote([quotes[index].text, author]);
  }, [refresh]);



  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file.size > 100000) {
      setImageError('File size should be less than 100kB');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
      setImageError("");
    }
  }


  const handleDone = useCallback(async () => {
    let config=null;
    let rating = 0;
    if (editedCodeforces){
      config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://codeforces.com/api/user.rating?handle=${editedCodeforces}`,
        headers: {}
      };

      await axios.request(config)
        .then((response) => {
          rating = response.data.result[response.data.result.length - 1].newRating.toString();
          setEditedRating(rating);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.comment);
        });
    }

    const data = {
      phone: editedPhone,
      registrationNo: editedRegistrationNo,
      shirtSize: editedShirtSize,
      codeforces: editedCodeforces,
      codeforcesRating: rating,
      image: image
    };

    config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${server}/users/editme`,
      headers: {
        contentType: 'application/json',
      },
      data: data,
      withCredentials: true,
    };

    await axios.request(config)
      .then((response) => {
        setIsEditing(false);
        toast.success("Profile updated successfully");
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
      });
  },[editedPhone, editedRegistrationNo, editedShirtSize, editedCodeforces, editedRating, image, setRefresh]);

  // New compact layout container classes
  const containerClasses = 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8';

  const Info = ({label, value}) => (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-words">{value || '-'} </p>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className={`pb-12 mt-4 space-y-5 ${containerClasses}`}>
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        )}
        {!loading && (
        <>
        {/* Top hero + quick access */}
        <div className="grid gap-4 md:grid-cols-5 items-stretch">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-primary-foreground p-5 flex flex-col justify-center md:col-span-3 shadow-sm">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
            <h2 className="text-base font-semibold tracking-tight mb-1">Welcome back</h2>
            <p className="text-2xl font-bold leading-tight mb-3">{editedName || 'User'}</p>
            <div className="text-xs max-w-sm opacity-90">
              <Quote text={quote[0]} author={quote[1]} />
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 flex flex-col justify-between md:col-span-2 shadow-sm">
            <p className="text-sm font-semibold tracking-tight mb-2">Quick Access</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/leaderboard"><Button variant="outline" className="h-9 w-full text-xs">Leaderboard</Button></Link>
              <Link to="/upcomingcontests"><Button variant="outline" className="h-9 w-full text-xs">Contests</Button></Link>
              <Link to="/community"><Button variant="outline" className="h-9 w-full text-xs">Community</Button></Link>
              <Link to="/codingstats"><Button className="h-9 w-full text-xs">Coding Stats</Button></Link>
            </div>
            <div className="mt-3 text-[10px] text-muted-foreground text-right">Stay consistent. Improve daily.</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm p-5 md:p-6">
          {isEditing ? (
            <div className="grid gap-4">
              <div className="grid gap-1">
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <Input value={editedName} disabled />
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <Input value={editedEmail} disabled />
              </div>
              <div className="grid gap-1 md:grid-cols-2 md:gap-4">
                <div className="grid gap-1"><label className="text-[11px] font-medium text-muted-foreground">Phone</label><Input value={editedPhone} onChange={e=>setEditedPhone(e.target.value)} /></div>
                <div className="grid gap-1"><label className="text-[11px] font-medium text-muted-foreground">Registration No.</label><Input value={editedRegistrationNo} onChange={e=>setEditedRegistrationNo(e.target.value)} /></div>
                <div className="grid gap-1"><label className="text-[11px] font-medium text-muted-foreground">Shirt Size</label><Input value={editedShirtSize} onChange={e=>setEditedShirtSize(e.target.value)} /></div>
                <div className="grid gap-1"><label className="text-[11px] font-medium text-muted-foreground">Codeforces Id</label><Input value={editedCodeforces} onChange={e=>setEditedCodeforces(e.target.value)} /></div>
              </div>
              <div className="grid gap-2 pt-1">
                {image && <img src={image} alt="Preview" className="h-32 w-32 object-cover rounded-md border" />}
                <input type="file" onChange={handleImage} className="text-xs" />
                {imageError && <p className="text-[10px] text-red-500">{imageError}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button variant="outline" className="w-full sm:w-1/2" type="button" onClick={()=>setIsEditing(false)}>Cancel</Button>
                <Button className="w-full sm:w-1/2" type="button" onClick={handleDone}>Save</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-lg font-semibold tracking-tight">Dashboard</h3>
                <Button size="sm" onClick={()=>setIsEditing(true)}>Edit Profile</Button>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Info label="Name" value={editedName} />
                <Info label="Email" value={editedEmail} />
                <Info label="Phone" value={editedPhone} />
                <Info label="Registration No." value={editedRegistrationNo} />
                <Info label="Shirt Size" value={editedShirtSize} />
                <Info label="Codeforces Id" value={editedCodeforces} />
                <Info label="Codeforces Rating" value={editedRating} />
                {imageUri && <div className="sm:col-span-2 md:col-span-3 flex flex-col items-start gap-2"><p className="text-xs uppercase text-muted-foreground">Profile Picture</p><img src={imageUri} alt="Profile" className="h-40 w-40 object-cover rounded-md border" /></div>}
              </div>
            </div>
          )}
        </div>
        {/* Secondary navigation removed (now in Quick Access) */}
        </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Home;
