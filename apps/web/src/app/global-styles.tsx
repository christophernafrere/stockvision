import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    body {
        font-family: var(--font-inter), sans-serif;
        background-color: #FAF8FF;
    }

    h1, h2, h3, h4, h5, h6, p {
        margin: 0;
        padding: 0;
    }
    a {

        color: black;
        text-decoration: none;
    }
`;

export default GlobalStyles;
