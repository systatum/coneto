import { RiSearchLine, RiCloseLine } from "@remixicon/react";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import styled, { CSSProp } from "styled-components";

export interface SearchboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  name: string;
  value: string;
  style?: CSSProp;
  containerStyle?: CSSProp;
  onChange: (data: ChangeEvent<HTMLInputElement>) => void;
}

const Searchbox = forwardRef<HTMLInputElement, SearchboxProps>(
  ({ name, value, onChange, style, containerStyle, ...props }, ref) => {
    const inputId = `textbox-${name}`;
    const inputRef = useRef<HTMLInputElement>(null);

    const valueLengthChecker = value.length > 0;

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    return (
      <SearchboxWrapper ref={ref} $style={containerStyle}>
        <SearchIcon size={14} />

        <SearchboxInput
          ref={inputRef}
          id={inputId}
          aria-label="textbox-search"
          name={name}
          value={value}
          onChange={onChange}
          $style={style}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />

        {valueLengthChecker && (
          <ClearIcon
            role="button"
            aria-label="delete-input"
            size={14}
            onClick={() => {
              const event = {
                target: {
                  name,
                  value: "",
                },
              } as ChangeEvent<HTMLInputElement>;
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

const SearchIcon = styled(RiSearchLine)`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #9ca3af;
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
