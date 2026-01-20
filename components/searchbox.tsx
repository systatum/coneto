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
      ...props
    },
    ref
  ) => {
    const [inputValueLocal, setInputValueLocal] = useState("");
    const isControlled = value !== undefined;
    const finalValue = isControlled ? value : inputValueLocal;

    const [isFocus, setIsFocus] = useState(false);

    const inputId = `textbox-${name}`;
    const inputRef = useRef<HTMLInputElement>(null);
    const anchorRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    const valueLengthChecker = finalValue.length > 0;

    const isOpenShowMenu = isFocus && showResultMenu;

    return (
      <SearchboxWrapper
        ref={anchorRef}
        aria-label="textbox-search-wrapper"
        $style={styles?.containerStyle}
        onFocus={() => setIsFocus(true)}
      >
        <SearchIcon $style={styles?.iconStyle} size={14} />

        <SearchboxInput
          ref={inputRef}
          id={inputId}
          aria-label="textbox-search"
          name={name}
          onChange={(e) => {
            setInputValueLocal(e.target.value);
            onChange(e);
          }}
          $focus={isFocus}
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
            onMouseDown={(e) => {
              e.preventDefault();
              const event = {
                target: {
                  name,
                  value: "",
                },
              } as ChangeEvent<HTMLInputElement>;
              setInputValueLocal("");
              onChange(event);
            }}
          />
        )}
      </SearchboxWrapper>
    );
  }
);

const SearchboxWrapper = styled.div<{ $style?: CSSProp }>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 4px;
  ${({ $style }) => $style};
`;

const SearchboxInput = styled.input<{ $style?: CSSProp; $focus?: boolean }>`
  border-radius: 9999px;
  padding: 8px 36px 8px 30px;
  width: 100%;
  font-size: 0.75rem;
  outline: none;
  background-color: white;
  border: 1px solid #d1d5db;

  &:focus {
    border-color: #61a9f9;
    box-shadow: 0 0 0 1px #61a9f9;
  }

  ${({ $focus }) =>
    $focus &&
    css`
      border-color: #61a9f9;
      box-shadow: 0 0 0 1px #61a9f9;
    `}

  ${({ $style }) => $style}
`;

const SearchIcon = styled(RiSearchLine)<{ $style?: CSSProp }>`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #9ca3af;

  ${({ $style }) => $style}
`;

const ClearIcon = styled(RiCloseLine)`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
`;

export { Searchbox };
