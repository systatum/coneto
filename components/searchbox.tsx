import { RiSearchLine, RiCloseLine } from "@remixicon/react";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled, { CSSProp } from "styled-components";

export interface SearchboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  name?: string;
  value?: string;
  style?: CSSProp;
  containerStyle?: CSSProp;
  iconStyle?: CSSProp;
  onChange?: (data: ChangeEvent<HTMLInputElement>) => void;
}

const Searchbox = forwardRef<HTMLInputElement, SearchboxProps>(
  (
    { name, value, onChange, style, containerStyle, iconStyle, ...props },
    ref
  ) => {
    const searchboxValue = value ? value : "";
    const [inputValueLocal, setInputValueLocal] = useState(searchboxValue);

    const inputId = `textbox-${name}`;
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    const valueLengthChecker = inputValueLocal.length > 0;

    return (
      <SearchboxWrapper
        aria-label="textbox-search-wrapper"
        $style={containerStyle}
      >
        <SearchIcon $style={iconStyle} size={14} />

        <SearchboxInput
          ref={inputRef}
          id={inputId}
          aria-label="textbox-search"
          name={name}
          value={inputValueLocal}
          onChange={(e) => {
            setInputValueLocal(e.target.value);
            onChange(e);
          }}
          $style={style}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
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

const SearchboxInput = styled.input<{ $style?: CSSProp }>`
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
