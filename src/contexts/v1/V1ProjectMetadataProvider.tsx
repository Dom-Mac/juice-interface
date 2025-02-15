import { PV_V1 } from 'constants/pv'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import useProjectIdForHandle from 'hooks/v1/contractReader/ProjectIdForHandle'
import { ProjectMetadata } from 'models/projectMetadata'
import { PropsWithChildren } from 'react'

export function V1ProjectMetadataProvider({
  handle,
  metadata,
  children,
}: PropsWithChildren<{
  handle: string
  metadata: ProjectMetadata | undefined
}>) {
  const { data: projectId } = useProjectIdForHandle(handle)

  const isArchived = projectId
    ? V1ArchivedProjectIds.includes(projectId.toNumber()) || metadata?.archived
    : false

  return (
    <ProjectMetadataContext.Provider
      value={{
        refetchProjectMetadata: () => {
          throw new Error(
            'V1ProjectMetadataProvider.refetchProjectMetadata called but is not implemented',
          )
        },
        projectMetadata: metadata,
        isArchived,
        projectId: projectId?.toNumber(),
        pv: PV_V1,
      }}
    >
      {children}
    </ProjectMetadataContext.Provider>
  )
}
