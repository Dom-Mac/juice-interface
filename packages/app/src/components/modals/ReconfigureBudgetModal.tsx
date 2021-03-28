import { BigNumber } from '@ethersproject/bignumber'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FundingDetailsFormFields } from 'components/PlayCreate/FundingDetails'
import { ProjectDetailsFormFields } from 'components/PlayCreate/ProjectDetails'
import { ProjectInfoFormFields } from 'components/PlayCreate/ProjectInfo'
import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import { UserContext } from 'contexts/userContext'
import { Budget } from 'models/budget'
import { useContext, useEffect, useState } from 'react'
import { parsePerMille, parseWad } from 'utils/formatCurrency'

export type ReconfigureFormFields = ProjectInfoFormFields &
  FundingDetailsFormFields &
  ProjectDetailsFormFields

export default function ReconfigureBudgetModal({
  budget,
  visible,
  onDone,
}: {
  budget: Budget | undefined
  visible?: boolean
  onDone?: VoidFunction
}) {
  const { transactor, contracts } = useContext(UserContext)
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<ReconfigureFormFields>()

  useEffect(() => {
    if (!budget) return

    // form.setFieldsValue({
    //   name: budget.name,
    //   duration: budget.duration.toString(),
    //   target: fromWad(budget.target),
    //   currency: budget.currency.toString() as BudgetCurrency,
    //   link: budget.link,
    //   discountRate: fromPerMille(budget.discountRate),
    //   reserved: fromPerMille(budget.reserved),
    // })
  }, [])

  if (!transactor || !contracts) return null

  async function saveBudget() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    const valid = await form.validateFields()

    if (!valid) return

    setLoading(true)

    const fields = form.getFieldsValue(true)

    transactor(
      contracts.BudgetStore,
      'configure',
      [
        parseWad(fields.target)?.toHexString(),
        BigNumber.from(fields.currency).toHexString(),
        BigNumber.from(fields.duration).toHexString(),
        fields.name,
        fields.link,
        parsePerMille(fields.discountRate).toHexString(),
        parsePerMille(fields.reserved).toHexString(),
      ],
      {
        onDone: () => {
          setLoading(false)
          if (onDone) onDone()
        },
      },
    )
  }

  return (
    <Modal
      title="Reconfigure budget"
      visible={visible}
      okText="Save changes"
      onOk={saveBudget}
      onCancel={onDone}
      confirmLoading={loading}
      width={800}
    >
      <Form form={form}>
        <Form.Item
          extra="How your project is identified on-chain"
          name="name"
          label="Name"
          rules={[{ required: true }]}
        >
          <Input
            className="align-end"
            placeholder="Peach's Juice Stand"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          extra="The amount of money you want/need in order to absolutely crush your mission statement."
          name="target"
          label="Operating cost"
          rules={[{ required: true }]}
        >
          <BudgetTargetInput
            value={form.getFieldValue('target')}
            onValueChange={val => form.setFieldsValue({ target: val })}
            currency={form.getFieldValue('currency')}
            onCurrencyChange={currency =>
              form.setFieldsValue({ currency: currency === '1' ? '0' : '1' })
            }
          />
        </Form.Item>
        <Form.Item
          extra="The duration of this budgeting scope."
          name="duration"
          label="Time frame"
          rules={[{ required: true }]}
        >
          <Input
            className="align-end"
            placeholder="30"
            type="number"
            suffix="days"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          extra="The percentage of your project's overflow that you'd like to reserve for yourself. In practice, you'll just receive some of your own tickets whenever someone pays you."
          name="reserved"
          label="Reserved tickets"
          initialValue={5}
        >
          <Input
            className="align-end"
            suffix="%"
            type="number"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          extra="The rate (95%-100%) at which payments to future budgeting time frames are valued compared to payments to the current one."
          name="discountRate"
          label="Discount rate"
          rules={[{ required: true }]}
          initialValue={97}
        >
          <Input
            className="align-end"
            suffix="%"
            type="number"
            min={95}
            max={100}
            placeholder="97"
            autoComplete="off"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
