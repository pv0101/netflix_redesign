import Image from 'next/legacy/image'//used legacy because tutorial used older next.js version
import { Movie } from '../typings'
import { useState, useEffect } from 'react'
import { baseUrl } from '../constants/movie'
import {FaPlay} from "react-icons/fa"
import { InformationCircleIcon } from '@heroicons/react/solid'

// Need to do interface Props here too
interface Props {
  netflixOriginals: Movie[]
}

function Banner({netflixOriginals}: Props) {//same syntax as in index.tsx

  //use TypeScript to define useState type. Movie or null
  const [movie, setMovie] = useState<Movie | null>(null)

  useEffect(() => {
    // Use random number (from 0 to 1) multiplied by length of netflixOriginals array and take the floor to get a random index. Randomize which movie is shown
    setMovie(netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)]
    )
  },[netflixOriginals])//dependency array. dependent on netflixOriginals. Every time netflixOriginals changes useEffect code will execute

  console.log(movie)

  return (
    // set styling for banner. Keep it from being behind the nav bar
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12">
      {/* set image styling */}
      <div className="absolute top-0 left-0 -z-10 h-[95vh] w-screen">
        {/* ? automatically added by TypeScript because we specified in useState that movie could be a null type too. So ? to make optional. Without ? we actually get error saying object is possibly null*/}
        {/* TMDB API gives only partial url in backdrop_path/poster_path. Need the baseUrl which is the first part. Combine the two url parts to get the image */}
        <Image 
        alt="" //Needed alt or Image would have red squiggly line. Everything still worked though. (this was before I changed to import Image from legacy version of next.js. I think newer version requires alt but tutorial used older version)
        src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
        layout="fill"
        objectFit="cover"//makes sure image is not stretched looking yet still takes full screen width.
        />
      </div>

      {/* set description styling */}
      <h1 className="text-2xl lg:text-7xl md:text-4xl font-bold">
        {movie?.title || movie?.name || movie?.original_name}
        </h1>
      <p className="max-w-xs text-shadow-md text-xs md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl">
        {movie?.overview}
        </p>

      <div className="flex space-x-3">
        <button className="bannerButton bg-white text-black">
          <FaPlay className="h-4 2-4 text-black md:h-7 md:w-7"/>Play
          </button>
        <button className="bannerButton bg-[gray]/70">
          More Info <InformationCircleIcon className="h-5 w-5 md:h-8 md:w-8"/>
          </button>
      </div>

    </div>

  )
}

export default Banner