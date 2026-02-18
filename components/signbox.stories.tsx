import { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./sidebar";
import { Signbox } from "./signbox";
import { useArgs } from "@storybook/preview-api";
import { StatefulOnChangeType } from "./stateful-form";
import { useState } from "react";
import { DropdownOptionProps } from "./field-lane";
import * as RemixIcons from "@remixicon/react";
import { css } from "styled-components";

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
        }}
      >
        <Signbox
          width="400px"
          height="200px"
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

export const WithDropdown: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText: "WFH",
      selectedOption: "2",
      value: "",
    });

    const ATTENDANCE_OPTIONS: DropdownOptionProps[] = [
      { text: "On-site", value: "1", icon: RemixIcons.RiHome2Line },
      { text: "WFH", value: "2", icon: RemixIcons.RiUser2Line },
      {
        text: "Sick leave",
        value: "3",
        icon: RemixIcons.RiSettings2Line,
      },
      {
        text: "Annual leave",
        value: "4",
        icon: RemixIcons.RiLogoutBoxLine,
      },
    ];

    return (
      <div
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Signbox
          clearable
          width="400px"
          height="150px"
          value={value.value}
          label="Signature"
          name="signature"
          dropdowns={[
            {
              width: "150px",
              styles: {
                drawerStyle: css`
                  width: 300px;
                `,
              },
              caption: value.selectedText,
              options: ATTENDANCE_OPTIONS,
              onChange: (id) => {
                const selected = ATTENDANCE_OPTIONS.find(
                  (option) => option.value === id
                );
                if (selected) {
                  setValue((prev) => ({
                    ...prev,
                    selectedOption: id,
                    selectedText: selected.text,
                  }));
                }
              },
              withFilter: true,
            },
          ]}
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
