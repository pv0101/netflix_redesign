// Custom hook. Works just like a normal function or component.

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'

import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase'

interface IAuth {
  user: User | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  loading: boolean
}

const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  error: null,
  loading: false
})

interface AuthProviderProps {
  children: React.ReactNode
}

// export here instead of at the end
export const AuthProvider = ({children}: AuthProviderProps) => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  // For persisting state? When user is logged in and refreshes it will go back to login page. This code keeps user logged in on refresh. 
  //Observer for state change of user. or listener for user event
  // Persisting the user
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Logged in...
          setUser(user)
          setLoading(false)
        } else {
          // Not logged in...
          setUser(null)
          setLoading(true)
          router.push('/login')
        }

        setInitialLoading(false)
      }),
    [auth]
  )

  // For signing up
  const signUp = async (email: string, password: string) => {
      setLoading(true)

      await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user)
        router.push('/') //push user to Home page url after logging in
        setLoading(false)
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false))
      // catch errors if Promise is rejected. finally for either Promise acceptance or rejection, Making sure setLoading(false) either way
  }


  // For signing in
  const signIn = async (email: string, password: string) => {
    setLoading(true)

    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setUser(userCredential.user)
      router.push('/') //push user to Home page url after logging in
      setLoading(false)
    })
    .catch((error) => alert(error.message))
    .finally(() => setLoading(false))
  }

  // For logging out
  const logout = async () => {
    setLoading(true)

    signOut(auth).then(() => {
      setUser(null)//log user out
    })
    .catch((error) => alert(error.message))
    .finally(() => setLoading(false))
  }

  // useMemo will only recompute memoized value when one of the dependencies change. Like useEffect?
  const memoedValue = useMemo(
    () => ({
    user, 
    signUp, 
    signIn, 
    loading, 
    logout, 
    error,
  }), 
  [user, loading]
  )

  // for custom hook, instead of returning jsx (html?) we return the variable or state
  // We want authProvider to wrap our whole application. And the whole application can be called "children". It will have Type React.ReactNode
  return (
    // can provide value directly like value = {{user, loading}} or use useMemo hook to make more performant
  <AuthContext.Provider value={ memoedValue }>
    {/* Block initial UI. Only show children when not loading */}
    {!initialLoading && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}

