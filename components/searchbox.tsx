import { RiSearchLine, RiCloseLine } from "@remixicon/react";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { Button, SubMenuButtonProps } from "./button";
import { TipMenuItemProps } from "./tip-menu";
import { StatefulForm } from "./stateful-form";
import { useTheme } from "./../theme/provider";
import { SearchboxThemeConfig } from "./../theme";

export interface SearchboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  name?: string;
  value?: string;
  onChange?: (data: ChangeEvent<HTMLInputElement>) => void;
  styles?: SearchboxStylesProps;
  resultMenu?: SearchboxResultMenuProps;
  showResultMenu?: boolean;
  safeAriaLabelSubMenu?: string[];
}

export interface SearchboxStylesProps {
  self?: CSSProp;
  containerStyle?: CSSProp;
  iconStyle?: CSSProp;
}

export type SearchboxResultMenuProps = (props: SubMenuButtonProps) => ReactNode;
export type SearchboxResultMenuItemProps = TipMenuItemProps;

const Searchbox = forwardRef<Omit<HTMLInputElement, "style">, SearchboxProps>(
  (
    {
      name,
      value,
      onChange,
      styles,
      safeAriaLabelSubMenu,
      resultMenu,
      showResultMenu,
      id,
      ...props
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const searchboxTheme = currentTheme.searchbox;

    const handleBlur = (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsFocus(false);
      }
    };

    const [inputValueLocal, setInputValueLocal] = useState("");
    const isControlled = value !== undefined;
    const finalValue = isControlled ? value : inputValueLocal;

    const [isFocus, setIsFocus] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const anchorRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    const valueLengthChecker = finalValue.length > 0;

    const isOpenShowMenu = isFocus && showResultMenu;

    const inputId = StatefulForm.sanitizeId({
      prefix: "searchbox",
      name,
      id,
    });

    return (
      <SearchboxWrapper
        ref={anchorRef}
        aria-label="textbox-search-wrapper"
        $style={styles?.containerStyle}
        onFocus={() => setIsFocus(true)}
        onBlur={handleBlur}
      >
        <SearchIcon
          $theme={searchboxTheme}
          $style={styles?.iconStyle}
          size={14}
        />

        <SearchboxInput
          $theme={searchboxTheme}
          ref={inputRef}
          id={inputId}
          aria-label="textbox-search"
          name={name}
          onChange={(e) => {
            setInputValueLocal(e.target.value);
            if (onChange) {
              onChange(e);
            }
          }}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
          value={finalValue}
          $style={styles?.self}
        />

        <Button
          onOpen={(prop: boolean) => setIsFocus(prop)}
          open={isOpenShowMenu}
          anchorRef={anchorRef}
          showSubMenuOn="self"
          styles={{
            self: css`
              display: none;
            `,
          }}
          safeAreaAriaLabels={safeAriaLabelSubMenu}
          subMenu={(props) => resultMenu?.(props)}
        />

        {valueLengthChecker && (
          <ClearIcon
            role="button"
            aria-label="delete-input"
            size={14}
            $theme={searchboxTheme}
            onMouseDown={(e) => {
              e.preventDefault();
              const event = {
                target: {
                  name,
                  value: "",
                },
              } as ChangeEvent<HTMLInputElement>;
              setInputValueLocal("");
              if (onChange) {
                onChange(event);
              }
            }}
          />
        )}
      </SearchboxWrapper>
    );
  }
);

const SearchboxWrapper = styled.div<{
  $style?: CSSProp;
}>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 4px;

  ${({ $style }) => $style};
`;

const SearchboxInput = styled.input<{
  $style?: CSSProp;
  $theme?: SearchboxThemeConfig;
}>`
  border-radius: 9999px;
  padding: 8px 36px 8px 30px;
  width: 100%;
  font-size: 0.75rem;
  outline: none;
  ${({ $theme }) =>
    $theme &&
    css`
      background-color: ${$theme.backgroundColor};
      border: 1px solid ${$theme.borderColor};
      color: ${$theme.textColor};
    `};

  &:focus {
    ${({ $theme }) => css`
      background-color: ${$theme.activeBackgroundColor};
      border-color: ${$theme.focusBorderColor};
      box-shadow: ${$theme.focusShadow};
    `};
  }

  ${({ $style }) => $style}
`;

const SearchIcon = styled(RiSearchLine)<{
  $style?: CSSProp;
  $theme?: SearchboxThemeConfig;
}>`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);

  ${({ $theme }) =>
    $theme &&
    css`
      color: ${$theme.iconColor};
    `}

  ${({ $style }) => $style}
`;

const ClearIcon = styled(RiCloseLine)<{
  $theme?: SearchboxThemeConfig;
}>`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;

  ${({ $theme }) =>
    $theme &&
    css`
      color: ${$theme.clearIconColor};
    `}
`;

export { Searchbox };
