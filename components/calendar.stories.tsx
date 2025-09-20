import { Meta, StoryObj } from "@storybook/react";
import { ReactElement, useState } from "react";
import { Calendar } from "./calendar";
import { OptionsProps } from "./selectbox";
import styled from "styled-components";

const meta: Meta<typeof Calendar> = {
  title: "Input Elements/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: "",
    });

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        inputValue={value}
        setInputValue={setValue}
        format="mm/dd/yyyy"
      />
    );
  },
};

export const NoWeekends: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: "",
    });

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        inputValue={value}
        setInputValue={setValue}
        format="mm/dd/yyyy"
        disableWeekend
      />
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: "",
    });

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        inputValue={value}
        setInputValue={setValue}
        format="mm/dd/yyyy"
        selectabilityMode="multiple"
      />
    );
  },
};

export const MultipleNoWeekend: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: "",
    });

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        inputValue={value}
        setInputValue={setValue}
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
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: "",
    });

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        inputValue={value}
        setInputValue={setValue}
        format="mm/dd/yyyy"
        selectabilityMode="ranged"
      />
    );
  },
};

export const RangedNoWeekends: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: "",
    });

    return (
      <Calendar
        dayNames={DAY_NAMES}
        monthNames={MONTH_NAMES}
        inputValue={value}
        setInputValue={setValue}
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
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: "",
    });

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
        inputValue={value}
        setInputValue={setValue}
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
