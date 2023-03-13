import { BellIcon, SearchIcon } from '@heroicons/react/solid' //I am using v1.0.06 of heroicons to follow along with tutorial
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth'
import BasicMenu from './BasicMenu';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { logout } = useAuth()//for logging out

  useEffect(() => {//when component (Header) mounts this will execute because of empty dependency array. 
    //Does Header remount everytime you scroll on the page? It must be because otherwise this would only run one time.
    const handleScroll = () => {
      if (window.scrollY > 0) {//window is the app window. scrollY property > 0 means that the window has been scrolled
        setIsScrolled(true)
      }
      else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)//addEventListener is like onClick because they execute a function on an event. addEventListener can do more though like have mutliple event handlers?. 
    // Here, we are listening for the window to scroll and then execute handleScroll

    return () => {
      window.removeEventListener('scroll', handleScroll)//remove event handler (handleScroll)
    }
  },[])

  return (
    // top level curly braces in header className is so we can use JavaScript. `` is for template strings/template literals. ${} is for string interpolation (lets us put a placeholder that is replaced with corresponding value when string literal is evaluated)
    // When page is scrolled, change the background color of the header
    <header className={`${isScrolled && 'bg-[#141414]'}`}>
      {/* Left part of header bar */}
      <div className="flex items-center space-x-2 md:space-x-10">
        {/* Tailwind CSS makes styling quicker with shorthand? hover over each className like flex to see the CSS applied */}
        {/* Tailwind styles for responsiveness on smaller devices first. So this is all styling meant for phones or small devices */}
        <img
          src="https://rb.gy/ulxxee"
          width={100}
          height={100}
          className="cursor-pointer object-contain" //object-contain to maintain aspect ratio of image
        />
        {/* Not using next.js image component because we are using a svg image which requires extra steps to use in next.js image component */}

        <BasicMenu/>

        <ul className="hidden space-x-4 md:flex">
          <li className="headerLink">Home</li>
          {/* headerLink is custom class name */}
          <li className="headerLink">TV Shows</li>
          <li className="headerLink">Movies</li>
          <li className="headerLink">New & Popular</li>
          <li className="headerLink">My List</li>
        </ul>
      </div>

      {/* Right part of header bar */}
      <div className="flex items-center space-x-4 text-sm font-light">
        <SearchIcon className="hidden h-6 w-6 sm:inline  "/>
        <p className="hidden lg:inline">Kids</p>
        <BellIcon className="h-6 w-6" />
        {/* href is required for Link in Typescript? */}
        <Link href="/account">
          <img 
          // onClick = {logout} //used while /account page was not setup yet
          src="https://rb.gy/g1pwyx" 
          alt="" 
          className="cursor-pointer rounded"
          />
        </Link>
      </div>
    </header>
  );
}

export default Header;
