import { PriceImpact } from 'hooks/usePriceImpact'
import { useSwapFlowContext } from './useSwapFlowContext'
import { useEthFlowContext } from './useEthFlowContext'
import { useSwapActionHandlers } from 'state/swap/hooks'
import { useCallback } from 'react'
import { logTradeFlow } from '@cow/modules/trade/utils/logger'
import { swapFlow } from '@cow/modules/swap/services/swapFlow'
import { ethFlow } from '@cow/modules/swap/services/ethFlow'
import { useConfirmPriceImpactWithoutFee } from '@cow/common/hooks/useConfirmPriceImpactWithoutFee'

export function useHandleSwap(priceImpactParams: PriceImpact): () => Promise<void> {
  const swapFlowContext = useSwapFlowContext()
  const ethFlowContext = useEthFlowContext()
  const { confirmPriceImpactWithoutFee } = useConfirmPriceImpactWithoutFee()
  const { onChangeRecipient } = useSwapActionHandlers()

  return useCallback(async () => {
    if (!swapFlowContext && !ethFlowContext) return

    if (swapFlowContext) {
      logTradeFlow('SWAP FLOW', 'Start swap flow')
      await swapFlow(swapFlowContext, priceImpactParams, confirmPriceImpactWithoutFee)
    } else if (ethFlowContext) {
      logTradeFlow('ETH FLOW', 'Start eth flow')
      await ethFlow(ethFlowContext, priceImpactParams, confirmPriceImpactWithoutFee)
    }

    onChangeRecipient(null)
  }, [swapFlowContext, ethFlowContext, onChangeRecipient, priceImpactParams, confirmPriceImpactWithoutFee])
}
