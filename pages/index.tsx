//index is home page. Next.js lets you create pages (like login.ts) and it will auto redirect when you change url to /login unlike React which needs Routes
import Modal from '../components/Modal'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Row from '../components/Row'
import useAuth from '../hooks/useAuth'
import { Movie } from '../typings'
import requests from '../utils/requests'
import Plans from '../components/Plans'
import { getProducts, Product } from '@stripe/firestore-stripe-payments'
import payments from '../lib/stripe'
import useSubscription from '../hooks/useSubscription'
import useList from '../hooks/useList'

interface Props {
  netflixOriginals: Movie[]//netflixOriginals will be array of different Movies
  trendingNow: Movie[]
  topRated: Movie[]
  actionMovies: Movie[]
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  romanceMovies: Movie[]
  documentaries: Movie[]
  products: Product[] //Product type is from Stripe package
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
  products
  }: Props) => {
    const { loading, user } = useAuth()//custom hook for loading state and subscription 
    const showModal = useRecoilValue(modalState) //hook is the same as useState, does the same thing but with Recoil all we need to use is their custom hook? hook accepts Recoil value
    // useRecoilValue returns the value itself

    const subscription = useSubscription(user)//use custom hook. 

    const movie = useRecoilValue(movieState) //currently selected? movie inside Recoil store. 
    
    const list = useList(user?.uid) //use custom hook to get MyList for a particular user

    if (loading || subscription === null) return null //loading state statement

    if (!subscription) return <Plans products={products}/>

  return (
    <div 
    className={`relative h-screen bg-gradient-to-b  lg:h-[140vh] 
    ${showModal && "!h-screen overflow-hidden"}`}
    // if modal is showing disable scroll
    >
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
         {list.length > 0 && <Row title="My List" movies={list} />}
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

// Server side rendering for movies and subscription plans
export const getServerSideProps = async () => {
const products = await getProducts(payments, {//getProducts is function from Stripe
  includePrices:true,
      activeOnly: true //products can be archives or rendered inactive in Stripe. Want only active ones
    })
    .then((res) => res)
    .catch((error) => console.log(error.message))

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
      products, //return subscription plans as prop
    },
  }
}