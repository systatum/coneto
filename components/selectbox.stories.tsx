import { Meta, StoryObj } from "@storybook/react";
import { Selectbox } from "./selectbox";
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
    const [value, setValue] = useState("");

    return (
      <div className="w-64">
        <Selectbox
          inputValue={value}
          setInputValue={setValue}
          placeholder="click this place holder"
        >
          {(props) => (
            <ul
              {...(props.getFloatingProps?.() ?? {})}
              ref={props.refs.setFloating ?? null}
              style={{
                ...(props.floatingStyles ?? {}),
              }}
              tabIndex={-1}
              role="listbox"
              aria-label="Calendar"
              {...props}
              className="text-center border border-gray-300 cursor-pointer hover:bg-blue-100 mt-1 p-10"
              onClick={() => {
                props.setInputValue("Selectbox content default.");
                props.setIsOpen(false);
              }}
            >
              Selectbox content default.
            </ul>
          )}
        </Selectbox>
      </div>
    );
  },
};

export const SelectboxWithClearable: Story = {
  render: () => {
    const [value, setValue] = useState("");
    console.log(value);

    return (
      <div className="w-64">
        <Selectbox
          inputValue={value}
          setInputValue={setValue}
          placeholder="click this place holder"
          clearable
        >
          {(props) => (
            <ul
              {...(props.getFloatingProps?.() ?? {})}
              ref={props.refs.setFloating ?? null}
              style={{
                ...(props.floatingStyles ?? {}),
              }}
              tabIndex={-1}
              role="listbox"
              aria-label="Calendar"
              {...props}
              className="text-center border border-gray-300 cursor-pointer hover:bg-blue-100 mt-1 p-10"
              onClick={() => {
                props.setInputValue("Selectbox content with clearable.");
                props.setIsOpen(false);
              }}
            >
              Selectbox content with clearable.
            </ul>
          )}
        </Selectbox>
      </div>
    );
  },
};
