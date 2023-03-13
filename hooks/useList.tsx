// Custom hook for MyList feature. Will retrieve saved movies from firebase for each user

import { collection, DocumentData, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import { Movie } from "../typings"

function useList(uid: string | undefined) {//retrieve user ID. 
    const [list, setList] = useState<Movie[] | DocumentData[]>([])

    useEffect(() => {
        if (!uid) return

        return onSnapshot(collection(db, "customers", uid, "myList"), (snapshot) => {
            setList(snapshot.docs.map((doc) => ({//return an object that combines doc.id and data
                id: doc.id,
                ...doc.data(),
            })))
        })
    },[db, uid])
  return list
}

export default useList