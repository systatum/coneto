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
          type="calendar"
        >
          {(props) => (
            <p
              {...props}
              className="text-center border border-gray-300 mt-1 p-10"
            >
              test, this is page for selectbox
            </p>
          )}
        </Selectbox>
      </div>
    );
  },
};
