import { atomWithReset, useResetAtom } from 'jotai/utils'
import { ConfirmationModalProps } from '../pure/ConfirmationModal/ConfirmationModal'
import { useCallback } from 'react'
import { ApplicationModal } from 'state/application/reducer'
import { useCloseModal, useOpenModal } from 'state/application/hooks'
import { atom, useSetAtom } from 'jotai'
import { t } from '@lingui/macro'

type TriggerConfirmationParams = Pick<
  ConfirmationModalProps,
  'title' | 'description' | 'callToAction' | 'warning' | 'confirmWord' | 'action' | 'skipInput'
>

interface ConfirmationModalContext {
  onDismiss: () => void
  activePromise?: Promise<boolean>
  title: string
  callToAction: string
  description?: string
  warning?: string
  confirmWord: string
  action: string
  onEnable: () => void
  skipInput?: boolean
  triggerConfirmation: ({
    title,
    description,
    callToAction,
    warning,
    skipInput,
  }: TriggerConfirmationParams) => Promise<void>
}

const DEFAULT_CONFIRMATION_MODAL_CONTEXT: ConfirmationModalContext = {
  onDismiss: () => {},
  onEnable: () => {},
  title: 'Confirm Action',
  callToAction: 'Confirm',
  confirmWord: t`confirm`,
  action: 'confirm',
  skipInput: false,
  triggerConfirmation: async () => {},
}

export const confirmationModalContextAtom = atomWithReset<ConfirmationModalContext>(DEFAULT_CONFIRMATION_MODAL_CONTEXT)
export const updateConfirmationModalContextAtom = atom(
  null,
  (get, set, nextState: Partial<ConfirmationModalContext>) => {
    set(confirmationModalContextAtom, () => {
      const prevState = get(confirmationModalContextAtom)

      return { ...prevState, ...nextState }
    })
  }
)

export function useConfirmationRequest({
  onEnable: onEnableParam = () => {},
  onDismiss: onDismissParam = () => {},
}: Partial<Pick<ConfirmationModalContext, 'onEnable' | 'onDismiss'>>) {
  const openModal = useOpenModal(ApplicationModal.CONFIRMATION)
  const closeModal = useCloseModal(ApplicationModal.CONFIRMATION)
  const setContext = useSetAtom(updateConfirmationModalContextAtom)
  const resetContext = useResetAtom(confirmationModalContextAtom)
  const triggerConfirmation = useCallback(
    (params: TriggerConfirmationParams): Promise<boolean> => {
      return new Promise((resolve) => {
        const onDismiss = () => {
          closeModal()
          onDismissParam()
          resetContext()
          resolve(false)
        }

        const onEnable = () => {
          closeModal()
          onEnableParam()
          resetContext()
          resolve(true)
        }

        setContext({
          ...params,
          onDismiss,
          onEnable,
        })
        openModal()
      })
    },
    [setContext, openModal, closeModal, onDismissParam, resetContext, onEnableParam]
  )

  return triggerConfirmation
}
