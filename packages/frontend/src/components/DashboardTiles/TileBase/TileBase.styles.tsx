import styled, { css } from 'styled-components';

interface HeaderContainerProps {
    $isEditMode: boolean;
    $isHovering?: boolean;
    $isEmpty?: boolean;
}

export const HeaderContainer = styled.div<HeaderContainerProps>`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    ${(props) =>
        props.$isEditMode
            ? `
                &:hover {
                    cursor: grab;
                }
                &:active, &:focus {
                    cursor: grabbing;
                }
            `
            : ''}

    ${({ $isEmpty }) =>
        $isEmpty
            ? css`
                  position: absolute;
                  right: 16px;
              `
            : ''}
`;

interface TileTitleProps {
    $hovered?: boolean;
}

// FIXME: colors in this file are hardcoded to mantine values.
// #FFF is white, #212529 is gray.9
export const TitleWrapper = styled.div<TileTitleProps>`
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;

    &:hover {
        ${({ $hovered }) =>
            $hovered
                ? css`
                      white-space: normal;
                      overflow: visible;
                      z-index: 10;

                      a {
                          outline: 4px solid #fff;
                          background-color: #fff;
                      }
                  `
                : ''}
    }
`;

export const TileTitleLink = styled.a<TileTitleProps>`
    font-weight: 600;
    font-size: 16px;
    color: #212529;
    text-decoration: none;

    :hover {
        color: #212529 !important;
        text-decoration: underline;
        text-wrap: wrap;
    }

    ${({ $hovered }) =>
        css`
            ${$hovered
                ? css`
                      text-decoration: underline;
                  `
                : ''}

            &:not([href]) {
                cursor: default;
                text-decoration: none;

                &:hover {
                    ${$hovered
                        ? css`
                              text-decoration: none;
                          `
                        : ''}
                }
            }
        `}
`;

export const ChartContainer = styled.div`
    flex: 1;
    overflow: hidden;
    display: flex;
`;
