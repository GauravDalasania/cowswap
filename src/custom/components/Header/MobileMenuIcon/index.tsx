import styled, { css } from 'styled-components/macro'

const Wrapper = styled.div<{ isMobileMenuOpen: boolean; height?: number; width?: number; lineSize?: number }>`
  z-index: 102;
  display: flex;
  cursor: pointer;
  margin: 0 6px;
  position: relative;
  width: ${({ width }) => (width ? width + 'px' : '42px')};
  height: ${({ height }) => (height ? height + 'px' : '22px')};


  span {
    background-color: ${({ theme }) => theme.text1};
    border-radius: 3px;
    height: ${({ lineSize }) => (lineSize ? lineSize + 'px' : '3px')};
    position: absolute;
    transition: all 0.15s cubic-bezier(0.8, 0.5, 0.2, 1.4);
    width: 100%;
    margin: auto;
  }

  span:nth-child(1) {
    left: 0;
    top: 0;
  }

  span:nth-child(2) {
    left: 0;
    opacity: 1;
    top: 50%;
    bottom: 50%;
  }

  span:nth-child(3) {
    bottom: 0;
    left: 0;
    width: 75%;
  }


  ${({ isMobileMenuOpen }) =>
    isMobileMenuOpen &&
    css`
      span:nth-child(1) {
        transform: rotate(45deg);
        top: 50%;
        bottom: 50%;
      }

      span:nth-child(2) {
        opacity: 0;
      }

      span:nth-child(3) {
        transform: rotate(-45deg);
        top: 50%;
        bottom: 50%;
        width: 100%;
      }
    `};
  
}
`

interface IconProps {
  isMobileMenuOpen: boolean
  width?: number
  height?: number
  lineSize?: number
  onClick: () => void
}

export default function MobileMenuIcon({ isMobileMenuOpen, width, height, lineSize, onClick }: IconProps) {
  return (
    <Wrapper isMobileMenuOpen={isMobileMenuOpen} width={width} height={height} lineSize={lineSize} onClick={onClick}>
      <span></span>
      <span></span>
      <span></span>
    </Wrapper>
  )
}
