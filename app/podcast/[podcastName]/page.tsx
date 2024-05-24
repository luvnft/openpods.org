'use client'
import getPodcast from "@/app/api/getPodcast";
import { useState, useEffect } from "react";
import Image from "next/image";
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
    }[];
}

export default function Podcast({ params }: { params: { podcastName: string } }) {
    const [loading, setLoading] = useState(false);
    const [podcast, setPodcast] = useState<Podcast | null>(null);
    
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
    return (
        <main className="min-h-screen">
            {loading ? 
            (
                <div className="flex justify-center"><span className="loading loading-ring loading-lg"></span></div>
            ) : 
            (
                <section>
                    <div className="flex justify-center">
                        <div className=" w-80">
                            <img src={podcast?.imageUrl || "/default-image-url.jpg"} alt={podcast?.name || "No Name"} width="full" height={50} />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center pt-4">
                        <h2 className="font-bold text-center">{podcast?.name}</h2>
                        <p className="pt-3 m-2">{podcast?.description}</p>
                    </div>
                </section>
            )}
            {loading ? 
            (
                <></>
            ) : 
            (
                podcast?.episodes.map((episode) => (
                    <section className="flex flex-col p-3 m-3 bg-slate-500 rounded-xl" key={episode.uuid}>
                        <div>
                            <h2>{episode.name}</h2>
                        </div>
                        <div>
                            {episode.videoUrl !== null ? (<video src={episode.videoUrl} controls></video>) : (<></>)}
                            <audio src={episode.audioUrl} controls></audio>
                        </div>
                    </section>
                ))
            )}
        </main>
    );
}
