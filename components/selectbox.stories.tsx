import { Meta, StoryObj } from "@storybook/react";
import { OptionsProps, Selectbox } from "./selectbox";
import { useState } from "react";

const meta: Meta<typeof Selectbox> = {
  title: "Input Elements/Selectbox",
  component: Selectbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Selectbox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    const SELECTBOX_DATA: OptionsProps[] = [
      {
        text: "Selectbox content default.",
        value: 1,
      },
    ];

    return (
      <div
        style={{
          width: "256px",
        }}
      >
        <Selectbox
          options={SELECTBOX_DATA}
          inputValue={value}
          setInputValue={setValue}
          placeholder="click this place holder"
        >
          {(props) =>
            props.options.map((option, index) => {
              const { style: _style, ...restProps } = props;

              return (
                <ul
                  key={index}
                  {...(props.getFloatingProps?.() ?? {})}
                  ref={props.refs.setFloating ?? null}
                  style={{
                    textAlign: "center",
                    width: "100%",
                    border: "1px solid #d1d5db",
                    cursor: "pointer",
                    marginTop: "0.25rem",
                    padding: "2.5rem",
                    ...(props.floatingStyles ?? {}),
                  }}
                  tabIndex={-1}
                  role="listbox"
                  aria-label="Calendar"
                  {...restProps}
                  onClick={() => {
                    props.setInputValue(option);
                    props.setIsOpen(false);
                  }}
                >
                  {option.text}
                </ul>
              );
            })
          }
        </Selectbox>
      </div>
    );
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    const SELECTBOX_DATA: OptionsProps[] = [
      {
        text: "Selectbox content with clearable.",
        value: 1,
      },
    ];

    return (
      <div style={{ width: "256px" }}>
        <Selectbox
          options={SELECTBOX_DATA}
          inputValue={value}
          setInputValue={setValue}
          placeholder="click this place holder"
          clearable
        >
          {(props) =>
            props.options.map((option, index) => {
              const { style: _style, ...restProps } = props;

              return (
                <ul
                  key={index}
                  {...(props.getFloatingProps?.() ?? {})}
                  ref={props.refs.setFloating ?? null}
                  style={{
                    textAlign: "center",
                    width: "100%",
                    border: "1px solid #d1d5db",
                    cursor: "pointer",
                    marginTop: "0.25rem",
                    padding: "2.5rem",
                    ...(props.floatingStyles ?? {}),
                  }}
                  {...restProps}
                  tabIndex={-1}
                  role="listbox"
                  aria-label="Calendar"
                  onClick={() => {
                    props.setInputValue(option);
                    props.setIsOpen(false);
                  }}
                >
                  {option.text}
                </ul>
              );
            })
          }
        </Selectbox>
      </div>
    );
  },
};
