import { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./sidebar";
import { Signbox } from "./signbox";
import { Button } from "./button";
import { useArgs } from "@storybook/preview-api";
import { StatefulOnChangeType } from "./stateful-form";

const meta: Meta<typeof Signbox> = {
  title: "Input Elements/Signbox",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Signbox>;

export const Default: Story = {
  render: (args) => {
    const [, setArgs] = useArgs();

    const onChangeForm = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const { name, value } = e.target;

        setArgs({ ...args, [name]: value });
      }
    };

    return (
      <div
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 500,
        }}
      >
        <Signbox
          clearable
          value={args.value}
          label="Signature"
          name={"signature"}
          onChange={onChangeForm}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    value: "",
    showError: true,
    errorMessage: "Signature is required",
    clearable: true,
  },
  render: (args) => {
    const [, setArgs] = useArgs();

    const onChangeForm = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const { name, value } = e.target;

        setArgs({
          ...args,
          [name]: value,
          showError: !value,
          errorMessage: !value ? "Signature is required" : "",
        });
      }
    };

    return (
      <div
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 500,
        }}
      >
        <Signbox
          {...args}
          label="Signature"
          name={"signature"}
          onChange={onChangeForm}
        />
      </div>
    );
  },
};
