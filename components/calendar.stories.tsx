import { Meta, StoryObj } from "@storybook/react";
import { ReactElement, useState } from "react";
import { Calendar } from "./calendar";
import styled from "styled-components";

const meta: Meta<typeof Calendar> = {
  title: "Input Elements/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **Calendar** component is a flexible and interactive date picker designed for various selection scenarios such as single, multiple, and ranged dates.

It provides a clean UI for navigating months and years, supports custom formatting, and allows deep customization for styling and behavior.

---

### ✨ Features
- 📅 **Multiple selection modes**: single, multiple, ranged
- 🔁 **Month & year navigation**
- 🚫 Optional **weekend disabling**
- 📆 Custom **day & month labels**
- 🎯 **Today shortcut button**
- 🎨 Fully customizable **styles**
- 🔔 Event callbacks for **changes & interactions**

---

### ⚙️ Selection Modes

- \`single\`: Select one date
- \`multiple\`: Select multiple dates
- \`ranged\`: Select start and end date

---

### 📌 Usage Guidelines
- Use **single mode** for simple date picking
- Use **multiple mode** for tagging or event selection
- Use **ranged mode** for booking or reporting ranges
- Disable weekends when handling business-only workflows
        `,
      },
    },
  },
  argTypes: {
    selectedDates: {
      control: "object",
      description: `
Array of selected dates.

- Structure depends on \`selectabilityMode\`
- Single → one date
- Multiple → multiple dates
- Ranged → start & end date
      `,
      table: {
        type: { summary: "string[]" },
      },
    },

    onChange: {
      action: "changed",
      description: `
Triggered when selected dates change.

\`\`\`ts
(dates: string[]) => void
\`\`\`
      `,
      table: {
        type: { summary: "(dates: string[]) => void" },
      },
    },

    selectabilityMode: {
      control: { type: "select" },
      options: ["single", "multiple", "ranged"],
      description: `
Defines how users can select dates.

- \`single\` → one date only
- \`multiple\` → multiple independent dates
- \`ranged\` → start and end date
      `,
      table: {
        type: { summary: `"single" | "multiple" | "ranged"` },
        defaultValue: { summary: `"single"` },
      },
    },

    format: {
      control: { type: "select" },
      options: ["mm/dd/yyyy", "yyyy/mm/dd", "dd/mm/yyyy"],
      description: `
Format used to display selected dates.
      `,
      table: {
        type: { summary: "string" },
        defaultValue: { summary: `"mm/dd/yyyy"` },
      },
    },

    disableWeekend: {
      control: "boolean",
      description: `
Prevents selecting Saturday and Sunday.
      `,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    dayNames: {
      control: "object",
      description: `
Custom labels for days of the week.

Example:
\`\`\`ts
["Sun", "Mon", "Tue", ...]
\`\`\`
      `,
      table: {
        type: { summary: "string[]" },
      },
    },

    monthNames: {
      control: "object",
      description: `
Custom labels for months.

Example:
\`\`\`ts
["Jan", "Feb", "Mar", ...]
\`\`\`
      `,
      table: {
        type: { summary: "string[]" },
      },
    },

    yearPastReach: {
      control: "number",
      description: `
Number of past years available in dropdown.
      `,
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "80" },
      },
    },

    futurePastReach: {
      control: "number",
      description: `
Number of future years available in dropdown.
      `,
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "50" },
      },
    },

    todayButtonCaption: {
      control: "text",
      description: `
Custom label for the "Today" button.
      `,
      table: {
        type: { summary: "string" },
      },
    },

    footer: {
      control: false,
      description: `
Custom footer content.

Can be JSX or any ReactNode.
      `,
      table: {
        type: { summary: "ReactNode" },
      },
    },

    onClick: {
      action: "clicked",
      description: `
Triggered when the calendar is clicked.
      `,
      table: {
        type: { summary: "() => void" },
      },
    },

    onCalendarPeriodChanged: {
      action: "periodChanged",
      description: `
Triggered when month or year changes.
      `,
      table: {
        type: { summary: "() => void" },
      },
    },

    id: {
      control: "text",
      description: "Optional HTML id.",
      table: {
        type: { summary: "string" },
      },
    },

    name: {
      control: "text",
      description: "Optional HTML name.",
      table: {
        type: { summary: "string" },
      },
    },

    styles: {
      control: false,
      description: `
Custom styles override for the calendar.

Includes container, label, and body styling.
      `,
      table: {
        type: { summary: "CalendarStylesProps" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>();

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        selectedDates={value}
        onChange={setValue}
        format="mm/dd/yyyy"
      />
    );
  },
};

export const NoWeekends: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        selectedDates={value}
        onChange={setValue}
        format="mm/dd/yyyy"
        disableWeekend
      />
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        selectedDates={value}
        onChange={setValue}
        format="mm/dd/yyyy"
        selectabilityMode="multiple"
      />
    );
  },
};

export const MultipleNoWeekend: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        selectedDates={value}
        onChange={setValue}
        format="mm/dd/yyyy"
        selectabilityMode="multiple"
        disableWeekend
      />
    );
  },
};

export const Ranged: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        selectedDates={value}
        onChange={setValue}
        format="mm/dd/yyyy"
        selectabilityMode="ranged"
      />
    );
  },
};

export const RangedNoWeekends: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        selectedDates={value}
        onChange={setValue}
        format="mm/dd/yyyy"
        disableWeekend
        selectabilityMode="ranged"
      />
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    const date = new Date();
    const formatPHInitial = formatPHDate(date);

    const [phValue, setPhValue] = useState(formatPHInitial);

    const handleCalendarPeriodChanged = (e?: Date) => {
      const formatPH = formatPHDate(e);
      setPhValue(formatPH);
    };

    const footerContent: ReactElement = (
      <ContentWrapper>
        <span>Public Holiday: </span>
        <div>{phValue}</div>
      </ContentWrapper>
    );

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        selectedDates={value}
        onChange={setValue}
        format="mm/dd/yyyy"
        footer={footerContent}
        selectabilityMode="ranged"
        onCalendarPeriodChanged={handleCalendarPeriodChanged}
      />
    );
  },
};

const formatPHDate = (date: Date): string => {
  const monthDatePH = 10 + date.getMonth();
  const monthName = date.toLocaleDateString("en-US", { month: "long" });
  const yearDate = date.toLocaleDateString("en-US", { year: "numeric" });
  return `${monthDatePH} ${monthName}, ${yearDate}`;
};

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f3f4f6;
  font-size: 0.75rem;
  color: #6b7280;
  padding-left: 10px;
  padding-right: 10px;
  min-height: 60px;
`;
