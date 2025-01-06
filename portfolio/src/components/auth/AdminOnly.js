import { useAuth } from './AuthContext'

export const AdminOnly = ({ children }) => {
  const { user } = useAuth()
  console.log('AdminOnly user:', user)
  console.log('isAdmin value:', user?.isAdmin)

  if (user && user.isAdmin === true) {
    return children
  }

  return null
}

export default AdminOnly
