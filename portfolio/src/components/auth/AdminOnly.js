import { useAuth } from './AuthContext'

export const AdminOnly = ({ children }) => {
  const { isAdmin } = useAuth()

  if (isAdmin) {
    return children
  }

  return null
}

export default AdminOnly
