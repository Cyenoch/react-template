import { Button } from '@/components/ui/button'
import { useLogin } from '@privy-io/react-auth'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/')({
  component: Index,
})

function Index() {
  const { login } = useLogin({
    onComplete: (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      linkedAccount,
    ) => {
      console.log(
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        linkedAccount,
      )
      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounted
    },
    onError: (error) => {
      console.log(error)
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  })

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>

      <Button onClick={login}>Login</Button>
    </div>
  )
}
