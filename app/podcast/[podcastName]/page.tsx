'use client'
import Player from "@/app/components/Player";
import { useState, useEffect } from "react";
import getPodcast from "@/app/api/getPodcast";

interface Podcast {
    uuid: string;
    name: string;
    description: string;
    imageUrl: string;
    episodes: {
        uuid: string;
        name: string;
        description: string;
        audioUrl: string;
        videoUrl: string;
        datePublished: string;
    }[];
}

export default function Podcast({ params }: { params: { podcastName: string } }) {
    const [loading, setLoading] = useState(false);
    const [podcast, setPodcast] = useState<Podcast | null>(null);
    const [playerEnabled, setPlayerEnabled] = useState(false); // State to manage player visibility
    const [selectedEpisode, setSelectedEpisode] = useState<{ name: string, audioUrl: string } | null>(null);
    const [isPlaying, setIsPlaying] = useState(false); // State to manage player playback

    const startPlayer = (episode: { name: string, audioUrl: string }) => {
        setPlayerEnabled(true);
        setSelectedEpisode(episode);
    };

    useEffect(() => {
        const fetchPodcast = async () => {
            setLoading(true);
            try {
                const fetchedPodcast = await getPodcast(params.podcastName);
                if (fetchedPodcast) {
                    setPodcast(fetchedPodcast);
                } else {
                    console.error("Podcast not found");
                }
            } catch (error) {
                console.error("Error fetching podcast:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPodcast();
    }, [params.podcastName]);

    function epochToDate(epochTimeSeconds: number): string {
        // Convert epoch time to milliseconds
        const milliseconds = epochTimeSeconds * 1000;
    
        // Create a new Date object using the milliseconds
        const date = new Date(milliseconds);
    
        // Extract the date components (year, month, day)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
    
        // Format the date as "YYYY-MM-DD"
        const formattedDate = `${year}-${month}-${day}`;
    
        return formattedDate;
    }
    
    return (
        <main className="min-h-screen pt-24 bg-base-300">
            {loading ? 
            (
                <div className="flex justify-center"><span className="loading loading-ring loading-lg"></span></div>
            ) : 
            (
                <section>
                    <div className="flex justify-center">
                        <div className=" w-80">
                            <img className="rounded-2xl mt-4" src={podcast?.imageUrl || "/default-image-url.jpg"} alt={podcast?.name || "No Name"} width="full" height={50} />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center pt-4 bg-base-100 mt-4">
                        <h1 className="font-bold text-2xl text-center">{podcast?.name}</h1>
                        <p className="pt-3 m-2">{podcast?.description}</p>
                    </div>
                </section>
            )}
            {!loading && podcast?.episodes.map((episode) => (
                <section className="flex flex-col p-3 m-4 bg-base-100 border-2 border-secondary rounded-xl" key={episode.uuid}>
                    <div>
                        <h2 className="font-bold">{episode.name}</h2>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex items-end opacity-50">
                            <p className="">{epochToDate(Number(episode.datePublished))}</p>
                        </div>
                        <div className="">
                            <button className="btn btn-primary w-24 text-l btn-m" onClick={() => startPlayer({ name: episode.name, audioUrl: episode.audioUrl })}>Play</button>
                        </div>
                    </div>
                </section>
            ))}
            {selectedEpisode && playerEnabled && <Player key={selectedEpisode.audioUrl} audioUrl={selectedEpisode.audioUrl} name={selectedEpisode.name} isPlaying={isPlaying} setIsPlaying={setIsPlaying} setPlayerEnabled={setPlayerEnabled} />}
        </main>
    );
}
