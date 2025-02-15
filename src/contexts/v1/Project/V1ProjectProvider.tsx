import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useV1ProjectState } from 'contexts/v1/Project/V1ProjectState'

export const V1ProjectProvider: React.FC<{
  handle: string
}> = ({ children, handle }) => {
  const project = useV1ProjectState({ handle })

  return (
    <V1ProjectContext.Provider value={project}>
      {children}
    </V1ProjectContext.Provider>
  )
}
