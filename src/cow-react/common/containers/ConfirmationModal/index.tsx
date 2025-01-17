import { confirmationModalContextAtom } from '@cow/common/hooks/useConfirmationRequest'
import { ConfirmationModal as Pure, ConfirmationModalProps } from '@cow/common/pure/ConfirmationModal'
import { useAtomValue } from 'jotai'

export function ConfirmationModal({ isOpen, onDismiss }: Pick<ConfirmationModalProps, 'isOpen' | 'onDismiss'>) {
  const { title, callToAction, description, onEnable, warning, confirmWord, action, skipInput } =
    useAtomValue(confirmationModalContextAtom)

  return (
    <Pure
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={title}
      callToAction={callToAction}
      description={description}
      onEnable={onEnable}
      warning={warning}
      confirmWord={confirmWord}
      action={action}
      skipInput={skipInput}
    />
  )
}
