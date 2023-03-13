import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { DocumentData } from "firebase/firestore";
import { useRef, useState } from "react";
import { Movie } from "../typings";
import Thumbnail from "./Thumbnail";

interface Props {
  title: string
  // when using firebase
  movies: Movie[] | DocumentData[] 
  //movies: Movie[]; //not needed when firebase implemented
}

function Row({ title, movies }: Props) {
  // for carousel feature
  const rowRef = useRef<HTMLDivElement>(null); //like useState? quiet performance react hook?

  //for hiding left arrow when row is not scrolled
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);

    if (rowRef.current) {
      // scrollLeft is number of pixels that an element's content is scrolled from its left edge. clientWidth is  inner width of an element in pixels
      const { scrollLeft, clientWidth } = rowRef.current;
      console.log(rowRef);
      // if left arrow clicked (direction === left) then set scrollTo coordinate current coordinate (scrollLeft) minus clientWidth. Otherwise (right arrow clicked) add the coordinates
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      // scrollTo scrolls to coordinates. Here we specify left so number of pixels along the X axis to scroll. scrollTo is the coordinate that was calculated above
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="h-40 space-y-0.5 md:space-y-2">
      {/* Row title */}
      <h2 className="w-5/6 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>

      {/* Thumbnails and chevrons */}
      <div className="group relative md:-ml-2">
        <ChevronLeftIcon
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${
            !isMoved && "hidden"
          }`}
          onClick={() => handleClick("left")}
        />

        {/* Thumbnails. */}
        {/* map through movie array for thumbnails */}
        <div
          ref={rowRef}
          className="flex scrollbar-hide items-center space-x-0.5 overflow-x-scroll md:space-x-2.5 md:p-2"
        >
          {movies.map((movie) => (
            <Thumbnail key={movie.id} movie={movie} />
          ))}
        </div>

        <ChevronRightIcon
          className={`absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100`}
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
}

export default Row;
