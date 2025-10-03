import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipProps } from "./tooltip";
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

export const Link: Story = {
  render: () => {
    const Hover: TooltipProps = {
      children: <>Hover Tooltip</>,
      showDialogOn: "hover",
      dialog: "This tooltip appears on hover",
      containerStyle: css`
        font-size: 0.875rem;
        text-decoration: underline;
      `,
    } as const;

    const Click: TooltipProps = {
      children: "Click Tooltip",
      showDialogOn: "click",
      dialog: "This tooltip appears on click",
      underline: "blue",
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
    } as const;

    const StyledTooltip: TooltipProps = {
      children: "Styled Tooltip",
      showDialogOn: "hover",
      dialog: "Tooltip with custom styling",
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
    } as const;

    const DottedUnderlineTooltip: TooltipProps = {
      children: "Dotted Underline Tooltip",
      showDialogOn: "hover",
      dialog: "Tooltip with dotted underline trigger",
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
    } as const;

    const NoUnderlineTooltip: TooltipProps = {
      children: "No Underline Tooltip",
      showDialogOn: "hover",
      dialog: "Trigger text without underline",
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
    } as const;

    const BlueUnderlineTooltip: TooltipProps = {
      children: "Blue Underline Tooltip",
      showDialogOn: "click",
      underline: "blue",
      containerStyle: css`
        font-size: 0.875rem;
      `,
      dialog: "Clicked tooltip with blue underline",
      drawerStyle: css`
        background-color: #1d4ed8;
        color: white;
      `,
      arrowStyle: css`
        background-color: #1d4ed8;
      `,
    } as const;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <Tooltip {...Hover} />
        <Tooltip {...Click} />
        <Tooltip {...StyledTooltip} />
        <Tooltip {...DottedUnderlineTooltip} />
        <Tooltip {...NoUnderlineTooltip} />
        <Tooltip {...BlueUnderlineTooltip} />
      </div>
    );
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

    const contentDialog = (
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
    );

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "end",
        }}
      >
        <Tooltip
          showDialogOn="click"
          hideDialogOn="click"
          dialog={contentDialog}
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
        </Tooltip>
      </div>
    );
  },
};
