import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    --text: hsl(200, 14%, 4%);
    --background-light: hsl(200, 29%, 95%);
    --background: hsl(200, 13%, 91%);
    --background-dark: hsl(200, 15%, 80%);
    --primary: hsl(14, 13%, 68%);
    --primary-light: hsl(14, 13%, 75%);
    --secondary: hsl(76, 14%, 84%);
    --accent: hsl(14, 13%, 44%);
  }
`;

export default GlobalStyle;