import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { server } from '../main';
import axios from 'axios';
import ProtectedRoute from '../utils/ProtectedRoute';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

// Simple client-side sorting & filtering
const sorters = {
  rank: (a, b) => a.rank - b.rank,
  name: (a, b) => a.name.localeCompare(b.name),
  codeforcesRating: (a, b) => b.codeforcesRating - a.codeforcesRating,
};

const Leaderboard = () => {
  const [leader, setLeader] = useState([]);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('rank');
  const [asc, setAsc] = useState(true);

  useEffect(() => {
    axios.get(`${server}/leaderboard`, {
      withCredentials: true,
    })
      .then((res) => {
        const rankedLeaderboard = res.data.leaderboard;
        rankedLeaderboard.sort((a, b) => b.codeforcesRating - a.codeforcesRating);
        const sortedLeaderboard = rankedLeaderboard.map((item, index) => ({
          ...item,
          rank: index + 1,
        }));
        setLeader(sortedLeaderboard);
        toast.success("Leaderboard fetched successfully!");
      })
      .catch((e) => {
        console.error(e);
        toast.error(e.response.data.message);
       });
  }, []);

  const filtered = leader.filter(l =>
    !query || l.name.toLowerCase().includes(query.toLowerCase()) || l.codeforces?.toLowerCase().includes(query.toLowerCase())
  );
  const sorted = [...filtered].sort(sorters[sortKey]);
  if (!asc) sorted.reverse();

  const toggleSort = (key) => {
    if (key === sortKey) setAsc(!asc); else { setSortKey(key); setAsc(true); }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/20 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
            <div className="flex gap-2 items-center">
              <Input placeholder="Search name or handle" value={query} onChange={e=>setQuery(e.target.value)} className="w-56" />
              <Button variant="outline" onClick={()=>{setQuery('')}}>Reset</Button>
            </div>
          </div>
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={()=>toggleSort('rank')} className="cursor-pointer select-none">Rank {sortKey==='rank' && (asc?'▲':'▼')}</TableHead>
                  <TableHead onClick={()=>toggleSort('name')} className="cursor-pointer select-none">Name {sortKey==='name' && (asc?'▲':'▼')}</TableHead>
                  <TableHead>Codeforces Id</TableHead>
                  <TableHead onClick={()=>toggleSort('codeforcesRating')} className="cursor-pointer select-none">Rating {sortKey==='codeforcesRating' && (asc?'▲':'▼')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map(row => (
                  <TableRow key={row._id} className="hover:bg-accent/40">
                    <TableCell className="font-medium">{row.rank}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell className="text-muted-foreground">{row.codeforces || '-'}</TableCell>
                    <TableCell>{row.codeforcesRating}</TableCell>
                  </TableRow>
                ))}
                {sorted.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">No results.</TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption className="text-xs">Click headers to sort. {leader.length} competitors total.</TableCaption>
            </Table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Leaderboard;
