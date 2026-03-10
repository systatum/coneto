import { Meta, StoryObj } from "@storybook/react";
import { ReactElement, useState } from "react";
import { Calendar } from "./calendar";
import styled from "styled-components";

const meta: Meta<typeof Calendar> = {
  title: "Input Elements/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **Calendar** component is a highly flexible and interactive date selection tool, designed for both single and multiple date selection scenarios. It provides users with a visual calendar interface that supports precise date picking, range selection, and multi-date selection with optional weekend restrictions.

Key features include:
- **Selection Modes**: Supports single, multiple, and ranged date selection.
- **Customizable Display**: Configure day and month labels, year ranges, and disable weekends.
- **Interactive Navigation**: Quickly navigate months and years using built-in controls.
- **Today Shortcut**: Optional "Today" button to quickly jump to the current date.
- **Flexible Formatting**: Dates can be displayed in multiple formats (mm/dd/yyyy, dd/mm/yyyy, yyyy/mm/dd).
- **Styling Customization**: Full control over container, label, and date cell styles through CSS props.
- **Event Hooks**: Callback functions for date changes, calendar period changes, and click events.

This component is ideal for forms, dashboards, or any interface requiring intuitive date selection with robust customization and accessibility support.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    selectedDates: {
      control: "select",
      description:
        "An array of selected dates. Can be a single date, multiple dates, or a ranged selection depending on `selectabilityMode`.",
    },
    onChange: {
      action: "changed",
      description:
        "Callback function triggered when the selected dates change. Returns an array of formatted date strings.",
    },
    dayNames: {
      control: "object",
      description:
        "Custom names for the days of the week. Default is Sunday to Saturday abbreviations.",
    },
    monthNames: {
      control: "object",
      description: "Custom names for months. Default is January to December.",
    },
    disableWeekend: {
      control: "boolean",
      description: "If true, weekends cannot be selected.",
    },
    format: {
      control: { type: "select" },
      options: ["mm/dd/yyyy", "yyyy/mm/dd", "dd/mm/yyyy"],
      description: "Date format for displaying selected dates.",
    },
    yearPastReach: {
      control: "number",
      description:
        "Number of past years to include in the year selection dropdown. Default is 80.",
    },
    futurePastReach: {
      control: "number",
      description:
        "Number of future years to include in the year selection dropdown. Default is 50.",
    },
    onClick: {
      action: "clicked",
      description: "Callback function triggered on calendar click events.",
    },
    onCalendarPeriodChanged: {
      action: "periodChanged",
      description:
        "Callback triggered when the calendar month or year changes.",
    },
    selectabilityMode: {
      control: { type: "select" },
      options: ["single", "multiple", "ranged"],
      description:
        "Determines the date selection mode: single date, multiple dates, or a ranged selection.",
    },
    footer: {
      control: "object",
      description:
        "Custom footer content rendered at the bottom of the calendar.",
    },
    todayButtonCaption: {
      control: "text",
      description: "Custom caption text for the 'Today' button.",
    },
    styles: {
      control: false,
      description: "Custom styles for the calendar container, label, and body.",
    },
    id: {
      control: "text",
      description: "Optional HTML id for the calendar input.",
    },
    name: {
      control: "text",
      description: "Optional HTML name for the calendar input.",
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
