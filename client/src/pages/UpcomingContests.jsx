import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import useScreenSize from '../utils/useScreenSize.jsx';

const UpcomingContests = () => {
    const [upcomingContests, setUpcomingContests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { width } = useScreenSize();
    const isMobile = width < 640;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://codeforces.com/api/contest.list');
                const contests = response.data.result;
                const upcoming = contests.filter((contest) => contest.phase === 'BEFORE');
                setUpcomingContests(upcoming.reverse());
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
      <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6`}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Upcoming Contests</h1>
          <Button size="sm" variant="outline" onClick={()=>window.location.href='https://codeforces.com/contests?complete=true'}>All Contests</Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-60"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>
        ) : (
          <div className="grid gap-4">
            {upcomingContests.map(contest => (
              <div key={contest.id} className="group rounded-lg border bg-card p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h2 className="font-semibold text-base leading-tight flex-1">{contest.name}</h2>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-muted text-muted-foreground">{contest.type}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs mb-3 text-muted-foreground">
                  <div><span className="font-medium text-foreground">Start:</span> {new Date(contest.startTimeSeconds * 1000).toLocaleDateString()}</div>
                  <div><span className="font-medium text-foreground">Duration:</span> {Math.floor(contest.durationSeconds / 3600)}h</div>
                  <div><span className="font-medium text-foreground">Frozen:</span> {contest.frozen ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium text-foreground">ID:</span> {contest.id}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="sm:w-40" size="sm" onClick={()=>window.open(`https://codeforces.com/contest/${contest.id}`, '_blank')}>Register</Button>
                  <Button variant="outline" size="sm" className="sm:w-40" onClick={()=>window.open('https://codeforces.com/contests?complete=true','_blank')}>History</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
};

export default UpcomingContests;
