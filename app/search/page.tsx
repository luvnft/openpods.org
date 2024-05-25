'use client'
import { useState } from "react";
import searchPodcast from "../api/searchPodcast"
import Link from "next/link";

interface Podcast {
    uuid: string;
    name: string;
    rssUrl: string;
    imageUrl: string;
    description: string;
}

export default function Search() {
    const [query, setQuery] = useState("");
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(false);  // Loading state
    const [searchClicked, setSearchClicked] = useState(false);
    const fetchPodcasts = async () => {
        setLoading(true);  // Set loading to true when fetching starts
        setSearchClicked(true);
        if (query == "")
        {
            setLoading(false);
            return;
        }
        try {
            const res = await searchPodcast(query);
            if (res && res.searchForTerm && res.searchForTerm.podcastSeries) {
                const podcastsData = res.searchForTerm.podcastSeries.map((podcast: { uuid: string; name: string; rssUrl: string; imageUrl?: string; description?: string }) => ({
                    uuid: podcast.uuid,
                    name: podcast.name,
                    rssUrl: podcast.rssUrl,
                    imageUrl: podcast.imageUrl || "@/public/imageNotFound.jpg", // Provide a default value
                    description: podcast.description || 'No description available' // Provide a default value
                }));
                setPodcasts(podcastsData);
            }
        } catch (error) {
            console.error("Error fetching podcasts:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="pt-24 min-h-screen bg-base-300">
            <section id="searchInput" className="p-4">
                <div className="flex flex-col">
                    <input className="input input-bordered bg-base-100 input-primary" placeholder="Search by Name" onChange={e => {setQuery(e.target.value)}}></input>
                    <div className="flex justify-end">
                        <button className="btn mt-2 w-24 btn-info" onClick={fetchPodcasts}>Submit</button>
                    </div>
                </div>
            </section>
            <section id="podcastList">
                <div className="flex flex-col">
                    {loading ? 
                    (
                    <div className="flex justify-center">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                    ) : podcasts.length === 0 && searchClicked ? 
                    (
                    <div className="flex justify-center"><p>No results found</p></div>
                    ) : (
                        podcasts.map((podcast) => (
                            <div className="card card-compact m-2 bg-base-200" key={podcast.uuid}>
                                <div className="card border-4 card-bordered">
                                    <div className="w-64">
                                        <img src={podcast.imageUrl} alt={podcast.name} className=" rounded-xl" width="full" height="150"/>
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
                        ))
                    )}
                </div>
            </section>
        </main>
    )
}