import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./tooltip";
import { Button } from "./button";
import { FormFieldProps, StatefulForm } from "./stateful-form";
import { ChangeEvent, useState } from "react";
import { OptionsProps } from "./selectbox";
import { CountryCodeProps } from "./phonebox";
import z from "zod";
import { RiAddBoxLine } from "@remixicon/react";

const meta: Meta<typeof Tooltip> = {
  title: "Content/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Value on your Tooltip",
    },
    drawerClassName: {
      control: "text",
      description: "Styling on your drawer content of Tooltip",
    },
    containerClassName: {
      control: "text",
      description: "Styling on your Parent Tooltip",
    },
    arrowClassName: {
      control: "text",
      description: "Styling on your arrow Tooltip",
    },
    openOn: {
      control: "text",
      options: ["hover", "click"],
    },
    text: {
      control: "text",
      description: "This is your text before have action on Tooltip",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Hover: Story = {
  args: {
    text: "Hover Tooltip",
    openOn: "hover",
    children: "This tooltip appears on hover",
    containerClassName: "text-sm underline",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const Click: Story = {
  args: {
    text: "Click Tooltip",
    openOn: "click",
    children: "This tooltip appears on click",
    containerClassName: "text-blue-600 text-sm cursor-pointer",
    drawerClassName: "bg-blue-600 text-white",
    arrowClassName: "bg-blue-600 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const StyledTooltip: Story = {
  args: {
    text: "Styled Tooltip",
    openOn: "hover",
    children: "Tooltip with custom styling",
    containerClassName: "text-green-600 text-sm underline decoration-wavy",
    drawerClassName:
      "bg-green-700 text-white shadow-lg rounded px-3 py-1 text-sm",
    arrowClassName:
      "bg-green-700 text-white shadow-lg rounded px-3 py-1 text-sm",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const DottedUnderlineTooltip: Story = {
  args: {
    text: "Dotted Underline Tooltip",
    openOn: "hover",
    children: "Tooltip with dotted underline trigger",
    underline: "underline-dot",
    containerClassName: "text-sm",
    drawerClassName: "bg-gray-800 text-white",
    arrowClassName: "bg-gray-800 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const NoUnderlineTooltip: Story = {
  args: {
    text: "No Underline Tooltip",
    openOn: "hover",
    children: "Trigger text without underline",
    underline: "transparent",
    containerClassName: "font-semibold text-sm text-red-500",
    drawerClassName: "bg-red-600 text-white",
    arrowClassName: "bg-red-600 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const BlueUnderlineTooltip: Story = {
  args: {
    text: "Blue Underline Tooltip",
    openOn: "click",
    underline: "blue",
    containerClassName: "text-sm",
    children: "Clicked tooltip with blue underline",
    drawerClassName: "bg-blue-700 text-white",
    arrowClassName: "bg-blue-700 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const Custom: Story = {
  render: () => {
    const [value, setValue] = useState({
      division_name: "",
    });
    const onChangeDivisionEmployeeForm = (
      e?:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | FileList
        | { target: { name: string; value: CountryCodeProps } }
        | OptionsProps
    ) => {
      if (!e || typeof e !== "object") return;

      if ("target" in e && typeof e.target?.name === "string") {
        const target = e.target;
        const { name, value } = target as
          | HTMLInputElement
          | HTMLTextAreaElement;

        let updatedValue: string | boolean = value;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
          updatedValue = target.checked;
        }

        setValue((prev) => ({ ...prev, [name]: updatedValue }));
      }
    };

    const DIVISION_EMPLOYEE_FIELDS: FormFieldProps[] = [
      {
        name: "division_name",
        title: "Division Name",
        type: "text",
        required: true,
        onChange: onChangeDivisionEmployeeForm,
      },
    ];

    const divisionEmployeeSchema = z.object({
      division_name: z
        .string()
        .min(2, "Division name must be at least 2 characters long"),
    });

    return (
      <Tooltip
        containerClassName="w-fit px-3"
        arrowClassName="bg-black border"
        drawerClassName="w-fit left-4 border border-gray-200 bg-white text-black"
        text={
          <div className="flex flex-row items-center gap-1 text-sm">
            <RiAddBoxLine size={16} />
            <span>New Division</span>
          </div>
        }
        openOn="click"
        underline="transparent"
      >
        <div className="min-w-[300px] px-2 pt-2 pb-1">
          <StatefulForm
            fields={DIVISION_EMPLOYEE_FIELDS}
            formValues={value}
            validationSchema={divisionEmployeeSchema}
            mode="onChange"
          />
          <div className="mt-1 flex justify-end">
            <Button className="text-xs">Save</Button>
          </div>
        </div>
      </Tooltip>
    );
  },
};
