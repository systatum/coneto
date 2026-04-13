import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipDialogPlacement, TooltipProps } from "./tooltip";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  FormFieldProps,
  StatefulForm,
  StatefulOnChangeType,
} from "./stateful-form";
import { useState } from "react";
import z from "zod";
import { RiAddBoxLine, RiImage2Line } from "@remixicon/react";
import { css } from "styled-components";
import { OptionProps } from "./selectbox";
import { useTheme } from "./../theme/provider";

const meta: Meta<typeof Tooltip> = {
  title: "Content/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Tooltip is a floating overlay component displaying contextual information when users hover or click on a given element. 
It supports flexible placement, delay, custom styling, and controlled visibility.

---

### ✨ Features
- 🖱 **Trigger events**: Show or hide tooltip on \`hover\` or \`click\`.
- 📌 **Flexible placement**: Position tooltip above, below, left, or right of the target element.
- ⏱ **Delay support**: Optional delay for showing the tooltip on hover.
- 🎨 **Custom styles**: Override container, trigger, arrow, spacer, and drawer styles.
- 🧩 **Safe area**: Avoid closing tooltip when clicking on elements with specific aria-labels.
- 🛠 **Programmatic control**: Open or close tooltip using a ref.

---

### 📌 Usage
\`\`\`tsx
const tooltipRef = useRef<TooltipRef>(null);

<Tooltip
  ref={tooltipRef}
  dialog="This is a tooltip"
  showDialogOn="hover"
  hideDialogOn="hover"
  dialogPlacement="bottom"
  showDelayPeriod={300}
  styles={{
    drawerStyle: css\`background-color: #2563eb; color: white; padding: 6px 12px;\`,
    arrowStyle: css\`background-color: #2563eb;\`,
  }}
>
  <button>Hover me</button>
</Tooltip>

// Programmatically open/close
tooltipRef.current?.open();
tooltipRef.current?.close();
\`\`\`
`,
      },
    },
  },
  argTypes: {
    dialog: {
      description: "The content displayed inside the tooltip drawer.",
      control: "text",
    },
    children: {
      description: "The trigger element that the tooltip is attached to.",
      control: false,
    },
    showDialogOn: {
      description: "Event to trigger showing the tooltip.",
      control: { type: "select" },
      options: ["hover", "click"],
    },
    hideDialogOn: {
      description: "Event to trigger hiding the tooltip.",
      control: { type: "select" },
      options: ["hover", "click"],
    },
    dialogPlacement: {
      description: "Placement of the tooltip relative to the trigger.",
      control: { type: "select" },
      options: [
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
        "right",
        "right-start",
        "right-end",
      ],
    },
    showDelayPeriod: {
      description: "Delay in milliseconds before showing the tooltip on hover.",
      control: "number",
    },
    onVisibilityChange: {
      description: "Callback fired when tooltip visibility changes.",
      action: "visibilityChanged",
    },
    onClick: {
      description: "Click handler for the trigger element.",
      action: "clicked",
    },
    styles: {
      description:
        "Custom CSS styles for tooltip container, drawer, arrow, spacer, or trigger.",
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Link: Story = {
  render: () => {
    const Hover: TooltipProps = {
      children: "Hover Tooltip",
      showDialogOn: "hover",
      dialog: "This tooltip appears on hover",
      styles: {
        containerStyle: css`
          font-size: 0.875rem;
          text-decoration: underline;
        `,
      },
    } as const;

    const Click: TooltipProps = {
      children: "Click Tooltip",
      showDialogOn: "click",
      dialog: "This tooltip appears on click",
      styles: {
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
    } as const;

    const StyledTooltip: TooltipProps = {
      children: "Styled Tooltip",
      showDialogOn: "hover",
      dialog: "Tooltip with custom styling",
      styles: {
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
    } as const;

    const DottedUnderlineTooltip: TooltipProps = {
      children: "Dotted Underline Tooltip",
      showDialogOn: "hover",
      dialog: "Tooltip with dotted underline trigger",
      styles: {
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
    } as const;

    const NoUnderlineTooltip: TooltipProps = {
      children: "No Underline Tooltip",
      showDialogOn: "hover",
      dialog: "Trigger text without underline",
      styles: {
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
    } as const;

    const BlueUnderlineTooltip: TooltipProps = {
      children: "Blue Underline Tooltip",
      showDialogOn: "click",
      dialog: "Clicked tooltip with blue underline",
      styles: {
        containerStyle: css`
          font-size: 0.875rem;
        `,
        drawerStyle: css`
          background-color: #1d4ed8;
          color: white;
        `,
        arrowStyle: css`
          background-color: #1d4ed8;
        `,
      },
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

export const Positioning: Story = {
  render: () => {
    const Content = ({ placement }: { placement: TooltipDialogPlacement }) => (
      <Tooltip
        dialog={placement}
        showDialogOn="hover"
        dialogPlacement={placement}
        styles={{
          drawerStyle: css`
            font-family: monospace;
            font-size: 11px;
            white-space: nowrap;
          `,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
            cursor: "default",
            flexShrink: 0,
          }}
        >
          <RiImage2Line color="white" size={40} />
        </div>
      </Tooltip>
    );

    const empty = <div style={{ width: 60, height: 60 }} />;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 60px)",
          gridTemplateRows: "repeat(5, 60px)",
          gap: "16px",
          padding: "48px",
        }}
      >
        {empty}
        <Content placement="top-left" />
        <Content placement="top-center" />
        <Content placement="top-right" />
        {empty}

        <Content placement="left-top" />
        {empty}
        {empty}
        {empty}
        <Content placement="right-top" />

        <Content placement="left-center" />
        {empty}
        {empty}
        {empty}
        <Content placement="right-center" />

        <Content placement="left-bottom" />
        {empty}
        {empty}
        {empty}
        <Content placement="right-bottom" />

        {empty}
        <Content placement="bottom-left" />
        <Content placement="bottom-center" />
        <Content placement="bottom-right" />
        {empty}
      </div>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const { mode } = useTheme();
    const isDark = mode === "dark";

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
          <Button styles={{ self: { fontSize: "0.75rem" } }}>Save</Button>
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
          styles={{
            containerStyle: css`
              width: fit-content;
              padding: 0 12px;
            `,

            drawerStyle: css`
              width: fit-content;
              left: 1rem;
            `,
          }}
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

export const WithBadge: Story = {
  render: () => {
    const [value, setValue] = useState<{ name: string; role: string[] }>({
      name: "",
      role: [""],
    });
    const [isOpen, setIsOpen] = useState(false);

    const EMPLOYEE_OPTIONS: OptionProps[] = [
      { text: "Organization Owner", value: "1" },
      { text: "HR Manager", value: "2" },
      { text: "Member", value: "3" },
    ];

    const EMPLOYEE_FIELDS: FormFieldProps[] = [
      {
        name: "name",
        title: "Name",
        type: "text",
        required: true,
      },
      {
        name: "role",
        title: "Role",
        type: "combo",
        required: false,
        comboboxProps: {
          options: EMPLOYEE_OPTIONS,
        },
      },
    ];

    const divisionEmployeeSchema = z.object({
      name: z
        .string()
        .min(2, "Division name must be at least 2 characters long"),
      combo: z
        .array(z.string().min(1, "Choose one"))
        .min(1, "Combo must have at least one item")
        .refine(
          (arr) =>
            arr.every((val) =>
              EMPLOYEE_OPTIONS.some((opt) => opt.value === val)
            ),
          "Invalid value in combo"
        ),
    });

    const contentDialog = (
      <div
        style={{
          minWidth: 300,
          padding: "8px 8px 4px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <StatefulForm
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          onChange={({ currentState }) =>
            setValue((prev) => ({ ...prev, ...currentState }))
          }
          validationSchema={divisionEmployeeSchema}
          mode="onChange"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button styles={{ self: { fontSize: "0.75rem" } }}>Save</Button>
        </div>
      </div>
    );

    return (
      <Tooltip
        showDialogOn="hover"
        hideDialogOn="hover"
        dialogPlacement="top-left"
        onVisibilityChange={(isOpen) => {
          setIsOpen(isOpen);
        }}
        dialog={contentDialog}
        styles={{
          containerStyle: css`
            width: fit-content;
            padding: 0 12px;
          `,
          drawerStyle: css`
            width: fit-content;
            left: 1rem;
          `,
        }}
      >
        <Badge
          styles={{
            self: css`
              cursor: pointer;
              ${isOpen &&
              css`
                border-color: #045e95;
              `}
              transition: all ease-in-out 0.2s;
              &:hover {
                border-color: #045e95;
              }
            `,
          }}
          caption="M. Alim"
          withCircle
        />
      </Tooltip>
    );
  },
};

export const WithShowDelay: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Tooltip
        showDialogOn="hover"
        hideDialogOn="hover"
        dialogPlacement="top-left"
        onVisibilityChange={(isOpen) => {
          setIsOpen(isOpen);
        }}
        showDelayPeriod={2000}
        dialog={<div>This is a delay tooltip with 2 second.</div>}
      >
        <Badge
          styles={{
            self: css`
              cursor: pointer;
              ${isOpen &&
              css`
                border-color: #045e95;
              `}
              transition: all ease-in-out 0.2s;
              &:hover {
                border-color: #045e95;
              }
            `,
          }}
          caption="With Show Delay"
          withCircle
        />
      </Tooltip>
    );
  },
};
