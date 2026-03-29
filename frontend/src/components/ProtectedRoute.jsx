import { useContext } from "react"
import Cookies from 'js-cookie'
import { Navigate } from "react-router-dom"
import AppContext from "../context/AppContext"

export default function ProtectedRoute({element}){
    const {token} = useContext(AppContext)
    const authToken = token || Cookies.get('token')
   if(!authToken){
     return <Navigate to='/login' replace />
   }
   return element
}