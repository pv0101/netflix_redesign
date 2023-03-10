//index is home page. Next.js lets you create pages (like login.ts) and it will auto redirect when you change url to /login unlike React which needs Routes
import Modal from '../components/Modal'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Row from '../components/Row'
import useAuth from '../hooks/useAuth'
import { Movie } from '../typings'
import requests from '../utils/requests'

interface Props {
  netflixOriginals: Movie[]//netflixOriginals will be array of different Movies
  trendingNow: Movie[]
  topRated: Movie[]
  actionMovies: Movie[]
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  romanceMovies: Movie[]
  documentaries: Movie[]
}

// When using TypeScript need to provide data type. Props interface defined above
const Home = ({ 
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  }: Props) => {
    const { loading } = useAuth()//for loading state
    const showModal = useRecoilValue(modalState) //hook is the same as useState, does the same thing but with Recoil all we need to use is their custom hook? hook accepts Recoil value
    // useRecoilValue returns the value itself

    if (loading) return null //loading state statement

  return (
    <div className="relative h-screen bg-gradient-to-b  lg:h-[140vh]">
      <Head>
        <title>Home - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header/>
      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        {/* Cannot do server side rendering on component (Banner) only on pages so pass as prop to Banner component*/}
        {/* With TypeScript, Banner component will expect netflixOriginals so if we remove that piece here we will get error. Can put ? in Banner.tsx interface Prop code to make netflixOriginals optional so we won't get error */}
        <Banner netflixOriginals={netflixOriginals}/>
        
        <section className="md:space-y-24">
        <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          {/* My List Component*/}
          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>
      {/* only show modal if showModal is true */}
      {showModal && <Modal/>}
      
    </div>
  )
}

export default Home

// Server side rendering
export const getServerSideProps = async () => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([//use Promise.all to resolve all fetch requests with one line instead of doing await for all the fetch requests separately
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ])

  return {
    props: {//with server side rendering in next.js need to return props. Can then access props at the top of the application
      // netflixOriginals will have results and id. We want the results (movies)
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
    },
  }
}