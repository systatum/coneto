import { Meta, StoryObj } from "@storybook/react";
import { CountryCodeProps, Phonebox } from "./phonebox";
import { useState } from "react";
import { COUNTRY_CODES } from "./../constants/countries";
import { StatefulOnChangeType } from "./stateful-form";
import { DropdownOptionProps } from "./field-lane";
import * as RemixIcons from "@remixicon/react";
import { Calendar } from "./calendar";
import { css } from "styled-components";

const meta: Meta = {
  title: "Input Elements/Phonebox",
  component: Phonebox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
    phoneNumber: {
      control: "text",
      description: "The current phone number value",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '""' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Phonebox>;

export const DefaultPhonebox: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Enter your phone number",
  },
  render: (args) => {
    interface ValueProps {
      phone?: string;
      country_code?: CountryCodeProps;
    }

    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US"
    )!;

    const [value, setValue] = useState<ValueProps>({
      phone: "",
      country_code: DEFAULT_COUNTRY_CODES,
    });

    const handleChange = (e: StatefulOnChangeType) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    };

    return (
      <Phonebox
        {...args}
        value={value.phone}
        countryCodeValue={value.country_code}
        onChange={handleChange}
      />
    );
  },
};

export const WithDropdown: Story = {
  render: () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US"
    )!;
    const [value, setValue] = useState({
      selectedText1: "11/12/2025",
      selectedOption1: "11/12/2025",
      selectedText2: "WFH",
      selectedOption2: "2",
      phone: "",
      country_code: DEFAULT_COUNTRY_CODES,
    });

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

    const handleChange = (e: StatefulOnChangeType) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    };

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
      <Phonebox
        value={value.phone}
        countryCodeValue={value.country_code}
        onChange={handleChange}
        label="With Dropdown"
        dropdowns={[
          {
            width: "100px",
            caption: value.selectedText1,
            render: ({ render }) =>
              render(
                <Calendar
                  selectedDates={[value.selectedOption1]}
                  monthNames={MONTH_NAMES}
                  setSelectedDates={(date: string[]) =>
                    setValue((prev) => ({
                      ...prev,
                      selectedText1: date[0],
                      selectedOption1: date[0],
                    }))
                  }
                />
              ),
          },
          {
            width: "120px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: value.selectedText2,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (item) => item.value === id
              );
              if (selected) {
                setValue((prev) => ({
                  ...prev,
                  selectedOption2: id,
                  selectedText2: selected.text,
                }));
              }
            },
            withFilter: true,
          },
        ]}
      />
    );
  },
};

export const DisablePhonebox: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Can't edit",
    value: "+1234567890",
    disabled: true,
  },
  render: (args) => {
    return <Phonebox {...args} />;
  },
};

export const PhoneboxWithError: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Enter phone number",
    errorMessage: "Invalid phone number",
  },

  render: (args) => {
    interface ValueProps {
      phone?: string;
      country_code?: CountryCodeProps;
    }

    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US"
    )!;

    const [value, setValue] = useState<ValueProps>({
      phone: "",
      country_code: DEFAULT_COUNTRY_CODES,
    });

    const handleChange = (e: StatefulOnChangeType) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    };

    const phoneDigitsLength = value.phone?.replace(/\D/g, "").length ?? 0;

    const isValidPhone = phoneDigitsLength >= 8 && phoneDigitsLength <= 15;

    return (
      <Phonebox
        {...args}
        value={value.phone}
        countryCodeValue={value.country_code}
        onChange={handleChange}
        showError={!isValidPhone}
      />
    );
  },
};
