import {
  CheckIcon,
  PlusIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  XIcon,
} from "@heroicons/react/outline";
import MuiModal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "../atoms/modalAtom";
import { Element, Genre, Movie } from "../typings";
import ReactPlayer from "react-player/lazy"; //use lazy load. won't load until needed
import { FaPlay } from "react-icons/fa";
import { VolumeUpIcon } from "@heroicons/react/solid";
import { collection, deleteDoc, doc, DocumentData, onSnapshot, setDoc } from "firebase/firestore";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";
import { toast, Toaster } from "react-hot-toast";

function Modal() {
  const [showModal, setShowModal] = useRecoilState(modalState);
  // Components that need to read from and write to an atom should use useRecoilState(). useRecoilState returns a tuple (multiple values)

  const [movie, setMovie] = useRecoilState(movieState); //pull movie from Recoil store.

  const [trailer, setTrailer] = useState("");

  const [genres, setGenres] = useState<Genre[]>([]); //will be an array of genres with default value of empty array

  const [muted, setMuted] = useState(true); //make sure video is muted on start

  const [addedToList, setAddedToList] = useState(false); //for adding to MyList

  const { user } = useAuth(); //for adding movies to MyList

  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]) //for checking MyList

  // for toast styling
  const toastStyle = {
    background: 'white',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '15px',
    borderRadius: '9999px',
    maxWidth: '1000px',
  }

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

  // This is used in conjunction with other useEffect to make sure plus/check icon on modal changes and movies are deleted/added to myList properly. without the useEffects we were only seeing the plus icon and only adding movies to myList because setAddedToList was not being used to update AddedToList (and because no re-rendering of modal?)
  // Find all the movies in the user's list
  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, 'customers', user.uid, 'myList'),
        (snapshot) => setMovies(snapshot.docs)//saves (snapshot of?) user's myList doc from firestore to movies variable
      )
    }
  }, [db, movie?.id])

  // This is used in conjunction with other useEffect to make sure plus/check icon on modal changes and movies are deleted/added to myList properly. without the useEffects we were only seeing the plus icon and only adding movies to myList because setAddedToList was not being used to update AddedToList (and because no re-rendering of modal?)
  // Check if the movie is already in the user's list
  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1 //goes through movies in MyList and sees if any match the currently selected movie in the modal. If not, setAddedToList(false)
      ),
    [movies]
  )


  // function for handling MyList buttons
  const handleList = async () => {
    if (addedToList) {
      await deleteDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!)
      )

      toast(
        `${movie?.title || movie?.original_name} has been removed from My List`,
        {
          duration: 8000,
          style: toastStyle
        }
      )
    } else {
      //if movie is not already added to the list, create/go to MyList doc and add movie to it
      await setDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!),
        { ...movie, }//whatever movie contains, spread and use all those parameters
      )

      toast(
        `${movie?.title || movie?.original_name} has been added to My List`,
        {
          duration: 8000,
          style: toastStyle
        }
      )
    }
  };

  // separate function for closing modal because we want to be able to click on overlay outside of modal to close or press the X in the corner of the modal
  const handleClose = () => {
    setShowModal(false);
  };
  return (
    // modal is open based on showModal state
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="fixex !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
    >
      <>
        {/* For pop up notification when MyList is changed */}
        <Toaster position="bottom-center" />
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

              {/* Add to MyList button */}
              <button className="modalButton" onClick={handleList}>
                {addedToList ? ( //change which icon used depending on whether movie has been added to MyList
                  <CheckIcon className="h-7 w-7" />
                ) : (
                  <PlusIcon className="h-7 w-7" />
                )}
              </button>

              {/* Thumbs Up icon */}
              <button>
                <ThumbUpIcon className="h-7 w-7" />
              </button>
            </div>

            {/* Mute control button */}
            <button className="modalButton" onClick={() => setMuted(!muted)}>
              {muted ? (
                <VolumeOffIcon className="h-6 w-6" />
              ) : (
                <VolumeUpIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Modal description */}
        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
          <div className="space-y-6 text-lg">
            <div className="flex items-center space-x-2 text-sm">
              {/* Vote percentage */}
              <p className="font-semibold text-green-400">
                {movie!.vote_average * 10}% Match
              </p>

              {/* Release Date */}
              <p className="font-light">
                {movie?.release_date || movie?.first_air_date}
              </p>

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
                  {genres.map((genre) => genre.name).join(", ")}
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
