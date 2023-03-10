import { DocumentData } from 'firebase/firestore'
import { atom } from 'recoil'
import { Movie } from '../typings'

// atoms are pieces of state. Atoms can be read from and written to from any component. Components that read the value of an atom are implicitly subscribed to that atom, so any atom updates will result in a re-render of all components subscribed to that atom
// Components that need to read from and write to an atom should use useRecoilState()

// one piece of state for modal
export const modalState = atom({
  key: 'modalState',
  default: false,
})

// one piece of state for Movie. When we click on any modal, we want to save movie to My List. This is what the piece of state is for. Types are Movie, DocumentData (from firebase) or null
export const movieState = atom<Movie | DocumentData | null>({
  key: 'movieState',
  default: null,
})