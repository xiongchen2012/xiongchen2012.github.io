import { createGlobalStyle} from "styled-components"

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 1.0s linear;
  }
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text};
  }
  `
  
export const lightTheme = {
    body: '#FFF',
    text: '#333',
}

export const darkTheme = {
    body: '#1a1919',
    text: '#999',
}