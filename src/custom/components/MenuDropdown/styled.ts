import styled from 'styled-components/macro'
import { darken } from 'polished'

export const MenuFlyout = styled.ol`
  display: flex;
  padding: 0;
  margin: 0;
  position: relative;

  > button {
    font-size: 16px;
    position: relative;
    display: flex;
    align-items: center;
    font-weight: 500;
    appearance: none;
    outline: 0;
    margin: 0 12px;
    padding: 0;
    background: 0;
    border: 0;
    cursor: pointer;
    transition: color 0.15s ease-in-out;
    color: ${({ theme }) => darken(0.3, theme.text1)};

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.text1};

      > svg > path {
        fill: ${({ theme }) => theme.text1};
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        height: 18px;
        width: 100%;
        bottom: -18px;
        left: 0;
        background: transparent;
      }
    }

    > svg {
      margin: 0 0 0 3px;
      width: 16px;
      height: 6px;
      object-fit: contain;

      > path {
        fill: ${({ theme }) => darken(0.3, theme.text1)};
        transition: fill 0.15s ease-in-out;
      }
    }
  }
`

export const Content = styled.div`
  display: flex;
  position: absolute;
  top: 100%;
  left: 0;
  background: red;
  border-radius: 16px;
  background: ${({ theme }) => theme.bg4};
  box-shadow: 0 12px 18px ${({ theme }) => theme.bg5};
  padding: 32px;
  gap: 62px;
  margin: 12px 0 0;

  > div {
    display: flex;
    flex-flow: column wrap;
  }
`

export const MenuTitle = styled.b`
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.75;
  letter-spacing: 2px;
  display: flex;
  margin: 0 0 6px;
`

export const MenuSection = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: flex-start;
  justify-items: flex-start;
  margin: 0;
  gap: 16px;

  a,
  button {
    display: flex;
    background: transparent;
    appearance: none;
    outline: 0;
    border: 0;
    cursor: pointer;
    font-size: 15px;
    white-space: nowrap;
    font-weight: 500;
    margin: 0;
    padding: 0;
    color: ${({ theme }) => theme.text1};
    gap: 12px;

    &:hover,
    &.ACTIVE {
      text-decoration: underline;
      font-weight: 500;
    }
  }

  a > svg,
  a > img {
    width: 18px;
    height: auto;
    max-height: 21px;
    object-fit: contain;
    color: ${({ theme }) => theme.text1};
  }

  a > svg > path {
    fill: ${({ theme }) => theme.text1};
  }
`
