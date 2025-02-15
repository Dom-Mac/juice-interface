import { Collapse, CollapsePanelProps, Divider } from 'antd'

export const CreateCollapsePanel: React.FC<
  CollapsePanelProps & { hideDivider?: boolean }
> = ({ hideDivider, ...props }) => {
  return (
    <Collapse.Panel {...props}>
      {
        <>
          {props.children}
          {!hideDivider && <Divider className="mb-0" />}
        </>
      }
    </Collapse.Panel>
  )
}
