import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./tooltip";
import { Button } from "./button";
import {
  FormFieldProps,
  StatefulForm,
  StatefulOnChangeType,
} from "./stateful-form";
import { useState } from "react";
import z from "zod";
import { RiAddBoxLine } from "@remixicon/react";
import { css } from "styled-components";

const meta: Meta<typeof Tooltip> = {
  title: "Content/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Hover: Story = {
  args: {
    text: "Hover Tooltip",
    openOn: "hover",
    children: "This tooltip appears on hover",
    containerStyle: css`
      font-size: 0.875rem;
      text-decoration: underline;
    `,
  },
};

export const Click: Story = {
  args: {
    text: "Click Tooltip",
    openOn: "click",
    children: "This tooltip appears on click",
    containerStyle: css`
      font-size: 0.875rem;
      color: #2563eb;
      cursor: pointer;
    `,
    drawerStyle: css`
      background-color: #2563eb;
      color: white;
    `,
    arrowStyle: css`
      background-color: #2563eb;
    `,
  },
};

export const StyledTooltip: Story = {
  args: {
    text: "Styled Tooltip",
    openOn: "hover",
    children: "Tooltip with custom styling",
    containerStyle: css`
      font-size: 0.875rem;
      color: #16a34a;
      text-decoration: underline wavy;
    `,
    drawerStyle: css`
      background-color: #15803d;
      color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 0.875rem;
    `,
    arrowStyle: css`
      background-color: #15803d;
    `,
  },
};

export const DottedUnderlineTooltip: Story = {
  args: {
    text: "Dotted Underline Tooltip",
    openOn: "hover",
    children: "Tooltip with dotted underline trigger",
    underline: "underline-dot",
    containerStyle: css`
      font-size: 0.875rem;
    `,
    drawerStyle: css`
      background-color: #1f2937;
      color: white;
    `,
    arrowStyle: css`
      background-color: #1f2937;
    `,
  },
};

export const NoUnderlineTooltip: Story = {
  args: {
    text: "No Underline Tooltip",
    openOn: "hover",
    children: "Trigger text without underline",
    underline: "transparent",
    containerStyle: css`
      font-weight: 600;
      font-size: 0.875rem;
      color: #ef4444;
    `,
    drawerStyle: css`
      background-color: #dc2626;
      color: white;
    `,
    arrowStyle: css`
      background-color: #dc2626;
    `,
  },
};

export const BlueUnderlineTooltip: Story = {
  args: {
    text: "Blue Underline Tooltip",
    openOn: "click",
    underline: "blue",
    containerStyle: css`
      font-size: 0.875rem;
    `,
    children: "Clicked tooltip with blue underline",
    drawerStyle: css`
      background-color: #1d4ed8;
      color: white;
    `,
    arrowStyle: css`
      background-color: #1d4ed8;
    `,
  },
};

export const WithForm: Story = {
  render: () => {
    const [value, setValue] = useState<{ division_name: string }>({
      division_name: "",
    });

    const onChangeDivisionEmployeeForm = (e?: StatefulOnChangeType) => {
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
        openOn="click"
        underline="transparent"
        text={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.875rem",
            }}
          >
            <RiAddBoxLine size={16} />
            <span>New Division</span>
          </div>
        }
        containerStyle={css`
          width: fit-content;
          padding: 0 12px;
        `}
        arrowStyle={css`
          background-color: #e5e7eb;
          border: 1px solid #e5e7eb;
        `}
        drawerStyle={css`
          width: fit-content;
          left: 1rem;
          background-color: white;
          color: black;
          border: 1px solid #e5e7eb;
        `}
      >
        <div style={{ minWidth: 300, padding: "8px 8px 4px" }}>
          <StatefulForm
            fields={DIVISION_EMPLOYEE_FIELDS}
            formValues={value}
            validationSchema={divisionEmployeeSchema}
            mode="onChange"
          />
          <div
            style={{
              marginTop: 4,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button style={{ fontSize: "0.75rem" }}>Save</Button>
          </div>
        </div>
      </Tooltip>
    );
  },
};
