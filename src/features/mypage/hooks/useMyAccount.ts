import { useQuery } from '@tanstack/react-query'
import { getMyAccount } from '../api/getMyAccount'

export function useMyAccount() {
  return useQuery({
    queryKey: ['myAccount'],
    queryFn: getMyAccount,
  })
}
