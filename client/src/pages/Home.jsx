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
  const [quote, setQuote] = useState([]);
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
    axios.get(`${server}/users/me`, {
      withCredentials: true,
    })
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
        toast.error(e.response.data.message);
      });

      const index = Math.floor(Math.random() * quotes.length);
      let author = quotes[index].author;
      author = author ? author.split(", ")[0] : "Unknown";
      setQuote([quotes[index].text, author]);
  }, [refresh]);



  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file.size > 100000) {
      setError('File size should be less than 100kB');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
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

  const containerWidth = isMobile ? 'mx-4' : 'mx-12';

  const Info = ({label, value}) => (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-words">{value || '-'} </p>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className={`pb-16 ${containerWidth} mt-4 space-y-6`}>
        <div className="rounded-lg bg-primary text-primary-foreground p-6 flex flex-col items-center shadow">
          <h2 className="text-lg font-semibold mb-2">Hello, {editedName}</h2>
          <Quote text={quote[0]} author={quote[1]} />
        </div>
        <div className="rounded-lg border bg-card shadow-sm p-6">
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
              <div className="grid gap-1"><label className="text-xs font-medium text-muted-foreground">Phone</label><Input value={editedPhone} onChange={e=>setEditedPhone(e.target.value)} /></div>
              <div className="grid gap-1"><label className="text-xs font-medium text-muted-foreground">Registration No.</label><Input value={editedRegistrationNo} onChange={e=>setEditedRegistrationNo(e.target.value)} /></div>
              <div className="grid gap-1"><label className="text-xs font-medium text-muted-foreground">Shirt Size</label><Input value={editedShirtSize} onChange={e=>setEditedShirtSize(e.target.value)} /></div>
              <div className="grid gap-1"><label className="text-xs font-medium text-muted-foreground">Codeforces Id</label><Input value={editedCodeforces} onChange={e=>setEditedCodeforces(e.target.value)} /></div>
              <div className="grid gap-2">
                {image && <img src={image} alt="Preview" className="h-32 w-32 object-cover rounded-md border" />}
                <input type="file" onChange={handleImage} className="text-xs" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="w-full" type="button" onClick={()=>setIsEditing(false)}>Cancel</Button>
                <Button className="w-full" type="button" onClick={handleDone}>Save</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              <h3 className="text-xl font-semibold tracking-tight text-center">Dashboard</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Info label="Name" value={editedName} />
                <Info label="Email" value={editedEmail} />
                <Info label="Phone" value={editedPhone} />
                <Info label="Registration No." value={editedRegistrationNo} />
                <Info label="Shirt Size" value={editedShirtSize} />
                <Info label="Codeforces Id" value={editedCodeforces} />
                <Info label="Codeforces Rating" value={editedRating} />
                {imageUri && <div className="sm:col-span-2 flex flex-col items-start gap-2"><p className="text-xs uppercase text-muted-foreground">Profile Picture</p><img src={imageUri} alt="Profile" className="h-40 w-40 object-cover rounded-md border" /></div>}
              </div>
              <div className="flex justify-center"><Button onClick={()=>setIsEditing(true)}>Edit</Button></div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <Link to="/leaderboard"><Button variant="outline" className="w-full">Leaderboard</Button></Link>
          <Link to="/upcomingcontests"><Button variant="outline" className="w-full">Contests</Button></Link>
          <Link to="/community"><Button variant="outline" className="w-full">Community</Button></Link>
          <Link to="/codingstats"><Button className="w-full">Coding Stats</Button></Link>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
