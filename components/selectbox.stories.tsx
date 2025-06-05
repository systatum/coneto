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

export const SelectboxDefault: Story = {
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
      <div className="w-64">
        <Selectbox
          options={SELECTBOX_DATA}
          inputValue={value}
          setInputValue={setValue}
          placeholder="click this place holder"
        >
          {(props) =>
            props.options.map((option, index) => (
              <ul
                key={index}
                {...(props.getFloatingProps?.() ?? {})}
                ref={props.refs.setFloating ?? null}
                style={{
                  ...(props.floatingStyles ?? {}),
                }}
                tabIndex={-1}
                role="listbox"
                aria-label="Calendar"
                {...props}
                className="text-center border w-full border-gray-300 cursor-pointer hover:bg-blue-100 mt-1 p-10"
                onClick={() => {
                  props.setInputValue(option);
                  props.setIsOpen(false);
                }}
              >
                {option.text}
              </ul>
            ))
          }
        </Selectbox>
      </div>
    );
  },
};

export const SelectboxWithClearable: Story = {
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
      <div className="w-64">
        <Selectbox
          options={SELECTBOX_DATA}
          inputValue={value}
          setInputValue={setValue}
          placeholder="click this place holder"
          clearable
        >
          {(props) =>
            props.options.map((option, index) => (
              <ul
                key={index}
                {...(props.getFloatingProps?.() ?? {})}
                ref={props.refs.setFloating ?? null}
                style={{
                  ...(props.floatingStyles ?? {}),
                }}
                tabIndex={-1}
                role="listbox"
                aria-label="Calendar"
                {...props}
                className="text-center border w-full border-gray-300 cursor-pointer hover:bg-blue-100 mt-1 p-10"
                onClick={() => {
                  props.setInputValue(option);
                  props.setIsOpen(false);
                }}
              >
                {option.text}
              </ul>
            ))
          }
        </Selectbox>
      </div>
    );
  },
};
