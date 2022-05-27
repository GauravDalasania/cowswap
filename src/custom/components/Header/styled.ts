import styled, { css } from 'styled-components/macro'
import { transparentize, darken } from 'polished'
import HeaderMod, {
  Title as TitleMod,
  HeaderLinks as HeaderLinksMod,
  HeaderControls as HeaderControlsUni,
  BalanceText as BalanceTextUni,
  AccountElement as AccountElementUni,
  StyledNavLink as StyledNavLinkUni,
  StyledMenuButton,
  HeaderFrame,
  HeaderElement as HeaderElementUni,
} from './HeaderMod'
import { MenuFlyout, MenuSection, Content as MenuContent, MenuTitle } from 'components/MenuDropdown/styled'

export const StyledNavLink = styled(StyledNavLinkUni)`
  transition: color 0.15s ease-in-out;
  color: ${({ theme }) => darken(0.3, theme.text1)};

  &:first-of-type {
    margin: 0 12px 0 0;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.text1};
  }
`

export const BalanceText = styled(BalanceTextUni)`
  font-weight: 500;
  padding: 0 6px 0 12px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    overflow: hidden;
    max-width: 100px;
    text-overflow: ellipsis;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const HeaderControls = styled(HeaderControlsUni)`
  justify-content: flex-end;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    max-width: 100%;
    margin: 0 0 0 auto;
    padding: 0;
    height: auto;
    width: auto;
  `};
`

export const HeaderElement = styled(HeaderElementUni)`
  border-radius: 0;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: flex-end;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 0;
    height: 64px;
    background-color: ${({ theme }) => transparentize(0.1, theme.bg3)};
    border-top: 1px solid ${({ theme }) => transparentize(0.7, theme.border)};
    backdrop-filter: blur(21px);
    padding: 10px 16px;
    gap: 8px;
  `}
`

export const Wrapper = styled.div`
  width: 100%;

  ${HeaderFrame} {
    padding: 16px;
    display: flex;

    ${({ theme }) => theme.mediaWidth.upToLarge`
      grid-template-columns: unset;
    `}

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 10px;
    `}
  }

  ${StyledMenuButton} {
    margin-left: 0.5rem;
    padding: 0;
    height: 38px;
    width: 38px;
  }
`

export const HeaderModWrapper = styled(HeaderMod)``

export const Title = styled(TitleMod)<{ isMobileMenuOpen: boolean }>`
  margin: 0;
  text-decoration: none;
  color: ${({ theme }) => theme.text1};

  ${({ theme, isMobileMenuOpen }) => theme.mediaWidth.upToLarge`
    ${
      isMobileMenuOpen &&
      css`
        z-index: 101;
      `
    }
  `};
`

export const HeaderLinks = styled(HeaderLinksMod)<{ isMobileMenuOpen: boolean }>`
  margin: 0;

  // Enforce uniform styling of different menu items/components
  > ${StyledNavLink}, > ${MenuFlyout} > button {
    font-size: 16px;
    position: relative;
    border-radius: 16px;
    display: flex;
    align-items: center;
    font-weight: 500;
    appearance: none;
    outline: 0;
    margin: 0 6px;
    padding: 6px 8px;
    background: 0;
    border: 0;
    cursor: pointer;
    background: transparent;
    transition: background 0.15s ease-in-out, color 0.15s ease-in-out;
    color: ${({ theme }) => transparentize(0.4, theme.text1)};

    ${({ theme }) => theme.mediaWidth.upToLarge`
      width: 100%;
      border-radius: 0;
      margin: 0;
      padding: 28px 16px;
      border-bottom: 1px solid ${({ theme }) => transparentize(0.9, theme.text1)};
    `};

    > svg > path {
      fill: ${({ theme }) => transparentize(0.4, theme.text1)};
      transition: fill 0.15s ease-in-out;
    }

    &:hover {
      color: ${({ theme }) => theme.text1};
      background: ${({ theme }) => transparentize(0.95, theme.text1)};

      > svg > path {
        fill: ${({ theme }) => theme.text1};
      }
    }

    &.ACTIVE {
      color: ${({ theme }) => theme.text1};
    }
  }

  ${MenuFlyout} {
    ${({ theme }) => theme.mediaWidth.upToLarge`
      width: 100%;
      flex-flow: column wrap;

      > button > svg {
        margin: 0 0 0 auto;
        height: 10px;
      }
    `};
  }

  ${MenuContent} {
    ${({ theme }) => theme.mediaWidth.upToLarge`
      padding: 28px 16px;
      gap: 42px;
    `};
  }

  ${MenuSection} {
    ${({ theme }) => theme.mediaWidth.upToLarge`
      gap 42px;
    `};
  }}

  ${MenuTitle} {
    ${({ theme }) => theme.mediaWidth.upToLarge`
      display: none;
    `};
  }}

  ${({ theme, isMobileMenuOpen }) => theme.mediaWidth.upToLarge`
    display: none;
    width: 100%;
    height: 100%;
    position: fixed;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 100;
    background: ${({ theme }) => theme.bg4};
    outline: 0;
    padding: 72px 8px;
    overflow-y: auto;

    ${
      isMobileMenuOpen &&
      css`
        display: flex;

        &::before {
          content: '';
          width: 100%;
          display: flex;
          height: 72px;
          background: ${({ theme }) => theme.bg4};
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1;
        }

        // transform: translate3d(100%, 0, 0);
      `
    }
  `};
`

export const TwitterLink = styled(StyledMenuButton)`
  > a {
    ${({ theme }) => theme.cursor};
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  > a > svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border: 0;
    display: flex;
    margin: 0;
    padding: 0;
    stroke: transparent;
  }

  > a > svg > path {
    fill: ${({ theme }) => theme.text1};
  }

  > a:hover > svg > path {
    fill: ${({ theme }) => theme.primary1};
  }
`

export const LogoImage = styled.div<{ isMobileMenuOpen?: boolean }>`
  width: 190px;
  height: 48px;
  background: ${({ theme }) => `url(${theme.logo.src}) no-repeat center/contain`};
  margin: 0 32px 0 0;
  position: relative;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    background: ${({ theme }) => `url(${theme.logo.srcIcon}) no-repeat left/contain`};
    height: 34px;
  `}

  ${({ theme, isMobileMenuOpen }) => theme.mediaWidth.upToLarge`
    ${
      isMobileMenuOpen &&
      css`
        background: ${({ theme }) => `url(${theme.logo.srcIcon}) no-repeat left/contain`};
        height: 34px;
      `
    }
  `}

  > svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

export const UniIcon = styled.div`
  display: flex;
  position: relative;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(-5deg);
  }
`

export const AccountElement = styled(AccountElementUni)<{ active: boolean }>`
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg4)};
  border-radius: 21px;
  border: 2px solid transparent;
  transition: border 0.2s ease-in-out;
  pointer-events: auto;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: auto;
    height: 100%;
  `}

  &:hover,
  &:focus {
    border: 1px solid ${({ theme }) => transparentize(0.4, theme.text1)};
  }

  ${BalanceText} {
    min-width: initial;
  }
`
