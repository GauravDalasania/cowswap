import { useCallback } from 'react'
import { Currency } from '@uniswap/sdk-core'
import { Txt } from 'assets/styles/styled'
import {
  FlexCol,
  FlexWrap,
  Wrapper,
  Container,
  GridWrap,
  CardHead,
  StyledContainer,
  StyledTime,
  ItemTitle,
  ChildWrapper,
  Loader,
  ExtLink,
  CardsWrapper,
  Card,
  CardActions,
  BannerCard,
  BalanceDisplay,
  ConvertWrapper,
  VestingBreakdown,
} from 'pages/Profile/styled'
import { useActiveWeb3React } from 'hooks/web3'
import Copy from 'components/Copy/CopyMod'
import { RefreshCcw } from 'react-feather'
import Web3Status from 'components/Web3Status'
import useReferralLink from 'hooks/useReferralLink'
import useFetchProfile from 'hooks/useFetchProfile'
import { getBlockExplorerUrl } from 'utils'
import { formatMax, formatSmartLocaleAware, numberFormatter } from 'utils/format'
import { getExplorerAddressLink } from 'utils/explorer'
import useTimeAgo from 'hooks/useTimeAgo'
import { MouseoverTooltipContent } from 'components/Tooltip'
import NotificationBanner from 'components/NotificationBanner'
import { SupportedChainId as ChainId } from 'constants/chains'
import AffiliateStatusCheck from 'components/AffiliateStatusCheck'
import { useHasOrders } from 'api/gnosisProtocol/hooks'
import { Title, SectionTitle, HelpCircle } from 'components/Page'
import { ButtonPrimary } from 'custom/components/Button'
import vCOWImage from 'assets/cow-swap/vCOW.png'
import SVG from 'react-inlinesvg'
import ArrowIcon from 'assets/cow-swap/arrow.svg'
import CowImage from 'assets/cow-swap/cow_v2.svg'
import CowProtocolImage from 'assets/cow-swap/cowprotocol.svg'
import { useTokenBalance } from 'state/wallet/hooks'
import { useVCowData, useSwapVCowCallback, useSetSwapVCowStatus, useSwapVCowStatus } from 'state/cowToken/hooks'
import { V_COW_CONTRACT_ADDRESS, COW_CONTRACT_ADDRESS, AMOUNT_PRECISION } from 'constants/index'
import { COW } from 'constants/tokens'
import { useErrorModal } from 'hooks/useErrorMessageAndModal'
import { OperationType } from 'components/TransactionConfirmationModal'
import useTransactionConfirmationModal from 'hooks/useTransactionConfirmationModal'
import { SwapVCowStatus } from 'state/cowToken/actions'
import AddToMetamask from 'components/AddToMetamask'
import { Link } from 'react-router-dom'
import CopyHelper from 'components/Copy'

const COW_DECIMALS = COW[ChainId.MAINNET].decimals

export default function Profile() {
  const referralLink = useReferralLink()
  const { account, chainId, library } = useActiveWeb3React()
  const { profileData, isLoading, error } = useFetchProfile()
  const lastUpdated = useTimeAgo(profileData?.lastUpdated)
  const isTradesTooltipVisible = account && chainId == 1 && !!profileData?.totalTrades
  const hasOrders = useHasOrders(account)

  const setSwapVCowStatus = useSetSwapVCowStatus()
  const swapVCowStatus = useSwapVCowStatus()

  // Cow balance
  const cow = useTokenBalance(account || undefined, chainId ? COW[chainId] : undefined)

  // vCow balance values
  const { unvested, vested, total, isLoading: isVCowLoading } = useVCowData()

  const cowBalance = formatSmartLocaleAware(cow, AMOUNT_PRECISION) || '0'
  const cowBalanceMax = formatMax(cow, COW_DECIMALS) || '0'
  const vCowBalanceVested = formatSmartLocaleAware(vested, AMOUNT_PRECISION) || '0'
  const vCowBalanceVestedMax = vested ? formatMax(vested, COW_DECIMALS) : '0'
  const vCowBalanceUnvested = formatSmartLocaleAware(unvested, AMOUNT_PRECISION) || '0'
  const vCowBalance = formatSmartLocaleAware(total, AMOUNT_PRECISION) || '0'
  const vCowBalanceMax = total ? formatMax(total, COW_DECIMALS) : '0'

  const hasVestedBalance = vested && !vested.equalTo(0)
  const hasVCowBalance = total && !total.equalTo(0)

  // Init modal hooks
  const { handleSetError, handleCloseError, ErrorModal } = useErrorModal()
  const { TransactionConfirmationModal, openModal, closeModal } = useTransactionConfirmationModal(
    OperationType.CONVERT_VCOW
  )

  // Boolean flags
  const isSwapPending = swapVCowStatus === SwapVCowStatus.SUBMITTED
  const isSwapInitial = swapVCowStatus === SwapVCowStatus.INITIAL
  const isSwapDisabled = Boolean(!hasVestedBalance || !isSwapInitial || isSwapPending)

  // Handle swaping
  const { swapCallback } = useSwapVCowCallback({
    openModal,
    closeModal,
  })

  const handleVCowSwap = useCallback(async () => {
    handleCloseError()

    if (!swapCallback) {
      return
    }

    setSwapVCowStatus(SwapVCowStatus.ATTEMPTING)

    swapCallback()
      .then(() => {
        setSwapVCowStatus(SwapVCowStatus.SUBMITTED)
      })
      .catch((error) => {
        console.error('[Profile::index::swapVCowCallback]::error', error)
        setSwapVCowStatus(SwapVCowStatus.INITIAL)
        handleSetError(error?.message)
      })
  }, [handleCloseError, handleSetError, setSwapVCowStatus, swapCallback])

  const tooltipText = {
    balanceBreakdown: (
      <VestingBreakdown>
        <span>
          <i>Unvested</i> <p>{vCowBalanceUnvested} vCOW</p>
        </span>
        <span>
          <i>Vested</i> <p>{vCowBalanceVested} vCOW</p>
        </span>
      </VestingBreakdown>
    ),
    vested: (
      <div>
        <p>
          <strong>Vested vCOW</strong> is the portion of your vCOW token balance, which is fully available to convert to
          COW token.
        </p>
        <p>
          This includes any vCOW received through an <strong>airdrop.</strong>
        </p>
        <p>When converting your vested vCOW balance to COW, your entire vested balance will be converted.</p>
      </div>
    ),
  }

  const renderNotificationMessages = (
    <>
      {error && (
        <NotificationBanner isVisible level="error" canClose={false}>
          There was an error loading your profile data. Please try again later.
        </NotificationBanner>
      )}
      {chainId && chainId !== ChainId.MAINNET && (
        <NotificationBanner isVisible level="info" canClose={false}>
          Affiliate data is only available for Ethereum. Please change the network to see it.
        </NotificationBanner>
      )}
    </>
  )

  return (
    <Container>
      <TransactionConfirmationModal />
      <ErrorModal />

      {chainId && chainId === ChainId.MAINNET && <AffiliateStatusCheck />}
      <Title>Profile</Title>

      <CardsWrapper>
        {hasVCowBalance && (
          <Card showLoader={isVCowLoading || isSwapPending}>
            <BalanceDisplay hAlign="left">
              <img src={vCOWImage} alt="vCOW token" width="56" height="56" />
              <span>
                <i>Total vCOW balance</i>
                <b>
                  <span title={`${vCowBalanceMax} vCOW`}>{vCowBalance} vCOW</span>{' '}
                  <MouseoverTooltipContent content={tooltipText.balanceBreakdown}>
                    <HelpCircle size={14} />
                  </MouseoverTooltipContent>
                </b>
              </span>
            </BalanceDisplay>
            <ConvertWrapper>
              <BalanceDisplay titleSize={18} altColor={true}>
                <i>
                  Vested{' '}
                  <MouseoverTooltipContent content={tooltipText.vested}>
                    <HelpCircle size={14} />
                  </MouseoverTooltipContent>
                </i>
                <b title={`${vCowBalanceVestedMax} vCOW`}>{vCowBalanceVested}</b>
              </BalanceDisplay>
              <ButtonPrimary onClick={handleVCowSwap} disabled={isSwapDisabled}>
                {isSwapPending ? (
                  'Converting vCOW...'
                ) : (
                  <>
                    Convert to COW <SVG src={ArrowIcon} />
                  </>
                )}
              </ButtonPrimary>
            </ConvertWrapper>

            <CardActions>
              <ExtLink
                href={getBlockExplorerUrl(
                  chainId || ChainId.MAINNET,
                  V_COW_CONTRACT_ADDRESS[chainId || ChainId.MAINNET],
                  'address'
                )}
              >
                Contract ↗
              </ExtLink>
              <CopyHelper toCopy={V_COW_CONTRACT_ADDRESS[chainId || ChainId.MAINNET]}>
                <div title="Click to copy token contract address">Copy contract</div>
              </CopyHelper>
            </CardActions>
          </Card>
        )}

        <Card>
          <BalanceDisplay titleSize={26}>
            <img src={CowImage} alt="Cow Balance" height="80" width="80" />
            <span>
              <i>Available COW balance</i>
              <b title={`${cowBalanceMax} COW`}>{cowBalance} COW</b>
            </span>
          </BalanceDisplay>
          <CardActions>
            <ExtLink
              title="View contract"
              href={getBlockExplorerUrl(
                chainId || ChainId.MAINNET,
                COW_CONTRACT_ADDRESS[chainId || ChainId.MAINNET],
                'address'
              )}
            >
              Contract ↗
            </ExtLink>

            {library?.provider?.isMetaMask && (
              <AddToMetamask shortLabel={true} currency={COW[chainId || ChainId.MAINNET] as Currency | undefined} />
            )}

            {!library?.provider?.isMetaMask && (
              <CopyHelper toCopy={COW_CONTRACT_ADDRESS[chainId || ChainId.MAINNET]}>
                <div title="Click to copy token contract address">Copy contract</div>
              </CopyHelper>
            )}

            <Link to={`/swap?outputCurrency=${COW_CONTRACT_ADDRESS[chainId || ChainId.MAINNET]}`}>Buy COW</Link>
          </CardActions>
        </Card>

        <BannerCard>
          <span>
            <b>CoW DAO Governance</b>
            <small>Use your (v)COW balance to vote on important proposals or participate in forum discussions.</small>
            <span>
              {' '}
              <ExtLink href={'https://snapshot.org/#/cow.eth'}>View proposals ↗</ExtLink>
              <ExtLink href={'https://forum.cow.fi/'}>CoW Forum ↗</ExtLink>
            </span>
          </span>
          <SVG src={CowProtocolImage} description="CoWDAO Governance" />
        </BannerCard>
      </CardsWrapper>

      <Wrapper>
        <GridWrap>
          <CardHead>
            <SectionTitle>Affiliate Program</SectionTitle>
            {account && (
              <Loader isLoading={isLoading}>
                <StyledContainer>
                  <Txt>
                    <RefreshCcw size={16} />
                    &nbsp;&nbsp;
                    <Txt secondary>
                      Last updated
                      <MouseoverTooltipContent content="Data is updated on the background periodically.">
                        <HelpCircle size={14} />
                      </MouseoverTooltipContent>
                      :&nbsp;
                    </Txt>
                    {!lastUpdated ? (
                      '-'
                    ) : (
                      <MouseoverTooltipContent content={<TimeFormatted date={profileData?.lastUpdated} />}>
                        <strong>{lastUpdated}</strong>
                      </MouseoverTooltipContent>
                    )}
                  </Txt>
                  {hasOrders && (
                    <ExtLink href={getExplorerAddressLink(chainId || ChainId.MAINNET, account)}>
                      <Txt secondary>View all orders ↗</Txt>
                    </ExtLink>
                  )}
                </StyledContainer>
              </Loader>
            )}
          </CardHead>
          {renderNotificationMessages}
          <ChildWrapper>
            <Txt fs={16}>
              <strong>Your referral url</strong>
            </Txt>
            <Txt fs={14} center>
              {referralLink ? (
                <>
                  <span style={{ wordBreak: 'break-all', display: 'inline-block' }}>
                    {referralLink.prefix}
                    <strong>{referralLink.address}</strong>
                    <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 8 }}>
                      <Copy toCopy={referralLink.link} />
                    </span>
                  </span>
                </>
              ) : (
                '-'
              )}
            </Txt>
          </ChildWrapper>
          <GridWrap horizontal>
            <ChildWrapper>
              <ItemTitle>
                Trades&nbsp;
                <MouseoverTooltipContent content="Statistics regarding your own trades.">
                  <HelpCircle size={14} />
                </MouseoverTooltipContent>
              </ItemTitle>
              <FlexWrap className="item">
                <FlexCol>
                  <span role="img" aria-label="farmer">
                    🧑‍🌾
                  </span>
                  <Loader isLoading={isLoading}>
                    <strong>{formatInt(profileData?.totalTrades)}</strong>
                  </Loader>
                  <Loader isLoading={isLoading}>
                    <span>
                      Total trades
                      {isTradesTooltipVisible && (
                        <MouseoverTooltipContent content="You may see more trades here than what you see in the activity list. To understand why, check out the FAQ.">
                          <HelpCircle size={14} />
                        </MouseoverTooltipContent>
                      )}
                    </span>
                  </Loader>
                </FlexCol>
                <FlexCol>
                  <span role="img" aria-label="moneybag">
                    💰
                  </span>
                  <Loader isLoading={isLoading}>
                    <strong>{formatDecimal(profileData?.tradeVolumeUsd)}</strong>
                  </Loader>
                  <Loader isLoading={isLoading}>
                    <span>Total traded volume</span>
                  </Loader>
                </FlexCol>
              </FlexWrap>
            </ChildWrapper>
            <ChildWrapper>
              <ItemTitle>
                Referrals&nbsp;
                <MouseoverTooltipContent content="Statistics regarding trades by people who used your referral link.">
                  <HelpCircle size={14} />
                </MouseoverTooltipContent>
              </ItemTitle>
              <FlexWrap className="item">
                <FlexCol>
                  <span role="img" aria-label="handshake">
                    🤝
                  </span>
                  <Loader isLoading={isLoading}>
                    <strong>{formatInt(profileData?.totalReferrals)}</strong>
                  </Loader>
                  <Loader isLoading={isLoading}>
                    <span>Total referrals</span>
                  </Loader>
                </FlexCol>
                <FlexCol>
                  <span role="img" aria-label="wingedmoney">
                    💸
                  </span>
                  <Loader isLoading={isLoading}>
                    <strong>{formatDecimal(profileData?.referralVolumeUsd)}</strong>
                  </Loader>
                  <Loader isLoading={isLoading}>
                    <span>Referrals volume</span>
                  </Loader>
                </FlexCol>
              </FlexWrap>
            </ChildWrapper>
          </GridWrap>
          {!account && <Web3Status openOrdersPanel={() => console.log('TODO')} />}
        </GridWrap>
      </Wrapper>
    </Container>
  )
}

interface TimeProps {
  date: string | undefined
}

const TimeFormatted = ({ date }: TimeProps) => {
  if (!date) return null

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const _date = new Date(date)
  const monthName = months[_date.getMonth()]
  const hours = _date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  return <StyledTime>{`${_date.getDate()} ${monthName} ${_date.getFullYear()} - ${hours}`}</StyledTime>
}

const formatDecimal = (number?: number): string => {
  return number ? numberFormatter.format(number) : '-'
}

const formatInt = (number?: number): string => {
  return number ? number.toLocaleString() : '-'
}
