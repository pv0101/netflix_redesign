import { PlusIcon, ThumbUpIcon, VolumeOffIcon, XIcon } from "@heroicons/react/outline";
import MuiModal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "../atoms/modalAtom";
import { Element, Genre } from "../typings";
import ReactPlayer from "react-player/lazy"; //use lazy load. won't load until needed
import { FaPlay } from "react-icons/fa";
import { VolumeUpIcon } from "@heroicons/react/solid";

function Modal() {
  const [showModal, setShowModal] = useRecoilState(modalState);
  // Components that need to read from and write to an atom should use useRecoilState(). useRecoilState returns a tuple (multiple values)

  const [movie, setMovie] = useRecoilState(movieState); //pull movie from Recoil store.

  const [trailer, setTrailer] = useState("");

  const [genres, setGenres] = useState<Genre[]>([]); //will be an array of genres with default value of empty array

  const [muted, setMuted] = useState(true); //make sure video is muted on start

  //every time we click a modal or movie changes, useEffect will fetch a video for us
  useEffect(() => {
    if (!movie) return;

    // Separate API for video trailers. Need new async await and fetch
    async function fetchMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === "tv" ? "tv" : "movie"
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      ) //using useEffect here instead of using requests.ts because in requests.ts it gives us multiple movies. Here we want only one specific movie (accomplished by &append_to_response=videos). Will not work if we add that string to requests.ts code
        .then((response) => response.json())
        .catch((err) => console.log(err.message));

      if (data?.videos) {
        //Make sure videos exist
        // findIndex returns index of first element in array that satisfies testing function
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === "Trailer"
        );
        setTrailer(data.videos?.results[index]?.key); //need key to render Youtube video trailer
      }
      if (data?.genres) {
        //Make sure genres exist
        setGenres(data.genres);
      }
    }
    fetchMovie();
  }, [movie]);

  // separate function for closing modal because we want to be able to click on overlay outside of modal to close or press the X in the corner of the modal
  const handleClose = () => {
    setShowModal(false);
  };
  return (
    // modal is open based on showModal state
    <MuiModal 
    open={showModal} 
    onClose={handleClose} 
    className="fixex !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide">
      <>
      {/* button for closing modal */}
        <button
          onClick={handleClose}
          className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]"
        >
          <XIcon className="h-6 w-6" />
        </button>

        {/* trailer video */}
        <div className="relative pt-[56.25%]">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`} //use the key stored in trailer variable to complete url. If there is no trailer can add a fallback using || operator. Show a gif or error picture
            width="100%"
            height="100%"
            style={{ position: "absolute", top: "0", left: "0" }}
            playing
            muted={muted}
          />
          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2">
              {/* play button on modal */}
              <button className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]">
                <FaPlay className="h-7 w-7 text-black" />
                Play
              </button>

              {/* Add to list button */}
              <button className="modalButton">
                <PlusIcon className="h-7 w-7"/>
              </button>

              {/* Thumbs Up icon */}
              <button>
                <ThumbUpIcon className="h-7 w-7" />
              </button>
            </div>

            {/* Mute control button */}
            <button className="modalButton" onClick={() => setMuted(!muted)}>
              {muted ? <VolumeOffIcon className="h-6 w-6"/> : <VolumeUpIcon className="h-6 w-6"/>}
            </button>
          </div>
        </div>

        {/* Modal description */}
        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
          <div className="space-y-6 text-lg">
            <div className="flex items-center space-x-2 text-sm">
              {/* Vote percentage */}
              <p className="font-semibold text-green-400">{movie!.vote_average * 10}% Match</p>
              
              {/* Release Date */}
              <p className="font-light">{movie?.release_date || movie?.first_air_date}</p>
              
              {/* HD  symbol */}
              <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                HD
              </div>
            </div>

            {/* Movie overview paragraph */}
            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <p className="w-5/6">{movie?.overview}</p>

              {/* Movie stats */}
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  {/* Genres list */}
                  <span className="text-[gray]">Genres: </span>
                  {/* map through all genre names associated with movie and join them with commas */}
                  {genres.map((genre) => genre.name).join(', ')}
                </div>

                {/* Language */}
                <div>
                  <span className="text-[gray]">Original language: </span>
                  {movie?.original_language}
                </div>

                {/* Vote Count */}
                <div>
                  <span className="text-[gray]">Total votes: </span>
                  {movie?.vote_count}
                </div>

              </div>
            </div>

          </div>
        </div>
      </>
    </MuiModal>
  );
}

export default Modal;
