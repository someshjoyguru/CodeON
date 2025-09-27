import React, { useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import ProtectedRoute from '../utils/ProtectedRoute';
import { Context } from '../main';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';

const CodingStats = () => {
  const { user } = useContext(Context);
  const [stats, setStats] = useState(null);
  const [contestHistory, setContestHistory] = useState([]);
  const [problemStats, setProblemStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchData = async (force=false) => {
    if (!user || !user.codeforces){
      setError('Enter your Codeforces handle from the dashboard');
      setIsLoading(false); return; }
    if (fetchedRef.current && !force) return; // prevent duplicate fetch
    fetchedRef.current = true;
    setIsLoading(true);
    try {
      const [statsResponse, contestHistoryResponse, problemStatsResponse] = await Promise.all([
        axios.get(`https://codeforces.com/api/user.info?handles=${user.codeforces}`),
        axios.get(`https://codeforces.com/api/user.rating?handle=${user.codeforces}`),
        axios.get(`https://codeforces.com/api/user.status?handle=${user.codeforces}`)
      ]);
      setStats(statsResponse.data.result[0]);
      setContestHistory(contestHistoryResponse.data.result);
      setProblemStats(problemStatsResponse.data.result);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch Codeforces data');
      toast.error('Failed to fetch Codeforces data');
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, [user]);
  
  const rows = contestHistory.map((c, i) => ({
    id: i,
    contestId: c.contestId,
    contestName: c.contestName,
    rank: c.rank,
    time: new Date(c.ratingUpdateTimeSeconds * 1000).toLocaleString(),
    oldRating: c.oldRating,
    newRating: c.newRating,
  }));

  const problemTypes = problemStats.reduce((acc, problem) => {
    const { problem: { tags } } = problem;
    tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const ratingDistribution = problemStats.reduce((acc, problem) => {
    const { problem: { rating } } = problem;
    if (rating) {
      acc[rating] = (acc[rating] || 0) + 1;
    }
    return acc;
  }, {});

  const problemTypesData = Object.keys(problemTypes).map(tag => ({ tag, count: problemTypes[tag] }));
  const ratingDistributionData = Object.keys(ratingDistribution).map(rating => ({ rating, count: ratingDistribution[rating] }));
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19FF4A', '#FFD319', '#19D1FF', '#8E19FF'
  ];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Coding Statistics</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={()=>fetchData(true)} disabled={isLoading}>Refresh</Button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : error ? (
          <div className="text-sm text-destructive font-medium">{error}</div>
        ) : (
          stats && (
            <div className="space-y-8">
              <div className="rounded-lg border p-6 bg-card shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-center">Statistics for: {stats.firstName ? `${stats.firstName} ${stats.lastName || ''}` : stats.handle}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><p className="text-xs uppercase text-muted-foreground">Handle</p><p className="font-medium">{stats.handle}</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Country</p><p className="font-medium">{stats.country || '-'}</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Current Rating</p><p className="font-medium">{stats.rating || '-'}</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Max Rating</p><p className="font-medium">{stats.maxRating} <span className="text-muted-foreground">{stats.maxRank}</span></p></div>
                  <div className="sm:col-span-2"><p className="text-xs uppercase text-muted-foreground">Current Rank</p><p className="font-medium">{stats.rank}</p></div>
                </div>
              </div>
              {contestHistory.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contest History</h3>
                  <div className="rounded-lg border overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contest</TableHead>
                          <TableHead>Rank</TableHead>
                          <TableHead>Old</TableHead>
                          <TableHead>New</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.slice(0,50).map(r => (
                          <TableRow key={r.id}>
                            <TableCell className="font-medium">{r.contestName}</TableCell>
                            <TableCell>{r.rank}</TableCell>
                            <TableCell>{r.oldRating}</TableCell>
                            <TableCell>{r.newRating}</TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">{r.time}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              {problemTypesData.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Types of Problems Solved</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={problemTypesData}
                        dataKey="count"
                        nameKey="tag"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {problemTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {ratingDistributionData.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Rating-wise Problems Solved</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ratingDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </ProtectedRoute>
  );
};

export default CodingStats;
