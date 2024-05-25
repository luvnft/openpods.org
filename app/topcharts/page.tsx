'use client'
import { useState, useEffect } from 'react';
import getTopCharts from "@/app/api/getTopCharts"; // Update import to use the new function
import Link from 'next/link';

interface Podcast {
    uuid: string;
    name: string;
    imageUrl: string;
    rssUrl: string;
    description: string;
}

export default function TopCharts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    async function fetchPodcasts() {
      try {
        const topPodcasts = await getTopCharts();
        setPodcasts(topPodcasts);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      } 
    }

    fetchPodcasts();
  }, []);
  return (
    <div className="flex flex-col bg-base-300">
        <section className="flex justify-center p-2 m-4">
            <h1 className="text-2xl font-bold">Todays Top Hits</h1>
        </section>
        {podcasts.map((podcast) => (
            <div className="card card-compact m-4 p-2 bg-base-200" key={podcast.uuid}>
               <div className="card border-4 card-bordered">
                   <div className="w-64 flex justify-between">
                       <img src={podcast.imageUrl} alt={podcast.name} className=" rounded-xl" width="full" height="150"/>
                       <h1>1</h1>
                   </div>
                   <div className="card-body">
                       <h2 className="card-title">{podcast.name}</h2>
                       <p className="">
                           {podcast.description !== null ? podcast.description.length > 200
                           ? podcast.description.substring(0, 200) + "..."
                           : podcast.description : (<p>No description</p>)}
                       </p>
                       <div className="card-actions justify-end">
                           <Link
                           href={"/podcast/" + podcast.name}
                           className="btn btn-info"
                           >
                           View Episodes
                           </Link>
                       </div>
                   </div>
               </div>
           </div>
        ))}
    </div>
  );
}
