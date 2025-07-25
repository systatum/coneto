import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ChangeEvent } from "react";
import { DormantText } from "./dormant-text";
import { Textbox } from "./textbox";
import { OptionsProps } from "./selectbox";
import { Combobox } from "./combobox";
import { expect, userEvent, within } from "@storybook/test";
import { Datebox } from "./datebox";
import { Colorbox, ColorPickProps } from "./colorbox";
import { formatMoneyboxNumber, Moneybox } from "./moneybox";
import { CountryCodeProps, formatPhoneboxNumber, Phonebox } from "./phonebox";
import { COUNTRY_CODES } from "./../constants/countries";
import { CountryCode } from "libphonenumber-js/types.cjs";
import { Timebox } from "./timebox";

const meta: Meta<typeof DormantText> = {
  title: "Stage/DormantText",
  component: DormantText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    layout: "padded",
  },

  render: () => {
    const [value, setValue] = useState({
      normal: "Hello there, this is dormanted text",
      full: "Hello there, this is dormanted text with full width",
      keydown: "Hello there, this is dormanted text with enable keydown",
    });

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      name: string
    ) => {
      const newValue = e.target.value;
      setValue((prev) => ({ ...prev, [name]: newValue }));
    };

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="font-medium">Normal Width</span>
          <DormantText
            content={value.normal}
            onActionClick={() => {
              console.log(`The value is : ${value.normal}`);
            }}
          >
            <Textbox
              value={value.normal}
              onChange={(e) => handleChange(e, "normal")}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Full Width</span>
          <DormantText
            fullWidth
            content={value.full}
            onActionClick={() => {
              console.log(`The value is : ${value.full}`);
            }}
          >
            <Textbox
              value={value.full}
              onChange={(e) => handleChange(e, "full")}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Change accepted by pressing enter</span>
          <DormantText
            fullWidth
            acceptChangeOn={"enter"}
            content={value.keydown}
            onActionClick={() => {
              console.log(`The value is : ${value.keydown}`);
            }}
          >
            <Textbox
              value={value.keydown}
              onChange={(e) => handleChange(e, "keydown")}
            />
          </DormantText>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const dormantLabel = await canvas.findByText(
      "Hello there, this is dormanted text"
    );
    await userEvent.click(dormantLabel);

    const textbox = await canvas.findByRole("textbox");
    await userEvent.clear(textbox);
    await userEvent.type(textbox, "Updated content");

    const checkButton = await canvas.findByRole("button");
    await userEvent.click(checkButton);

    await expect(textbox).toHaveValue("Updated content");

    const dormantFullWidthLabel = await canvas.findByText(
      "Hello there, this is dormanted text with full width"
    );
    await userEvent.click(dormantFullWidthLabel);

    const fullWidthTextbox = await canvas.findByRole("textbox");
    await userEvent.clear(fullWidthTextbox);
    await userEvent.type(fullWidthTextbox, "Updated content full");

    const fullWidthCheckButton = await canvas.findByRole("button");
    await userEvent.click(fullWidthCheckButton);

    await expect(fullWidthTextbox).toHaveValue("Updated content full");
  },
};

export const WithCombobox: Story = {
  parameters: {
    layout: "padded",
  },

  render: () => {
    const [value, setValue] = useState({
      normal: { text: "Apple", value: 1 },
      full: { text: "Banana", value: 2 },
      keydown: { text: "Orange", value: 3 },
    });

    const FRUIT_OPTIONS = [
      { text: "Apple", value: 1 },
      { text: "Banana", value: 2 },
      { text: "Orange", value: 3 },
      { text: "Grape", value: 4 },
      { text: "Pineapple", value: 5 },
      { text: "Strawberry", value: 6 },
      { text: "Watermelon", value: 7 },
    ];

    const handleChange = (e: OptionsProps, name: string) => {
      const newValue = e;
      setValue((prev) => ({ ...prev, [name]: newValue }));
    };

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="font-medium">Normal Width</span>
          <DormantText
            content={value.normal.text}
            onActionClick={() => {
              console.log(`Selected value: ${value.normal.value}`);
            }}
          >
            <Combobox
              placeholder="Select a fruit..."
              strict
              inputValue={value.normal}
              options={FRUIT_OPTIONS}
              setInputValue={(e) => handleChange(e, "normal")}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Full Width</span>
          <DormantText
            fullWidth
            content={value.full.text}
            onActionClick={() => {
              console.log(`Selected value: ${value.full.value}`);
            }}
          >
            <Combobox
              placeholder="Select a fruit full..."
              strict
              inputValue={value.full}
              options={FRUIT_OPTIONS}
              setInputValue={(e) => handleChange(e, "full")}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">
            Change accepted by pressing enter or clicking some values
          </span>
          <DormantText
            fullWidth
            acceptChangeOn={"all"}
            content={value.keydown.text}
            onActionClick={() => {
              console.log(`Selected value: ${value.keydown.value}`);
            }}
          >
            <Combobox
              placeholder="Select a fruit keydown..."
              strict
              inputValue={value.keydown}
              options={FRUIT_OPTIONS}
              setInputValue={(e) => handleChange(e, "keydown")}
            />
          </DormantText>
        </div>
      </div>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const normalLabel = await canvas.findByText("Apple");
    await userEvent.click(normalLabel);

    const input1 = await canvas.findByPlaceholderText("Select a fruit...");
    await userEvent.click(input1);
    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{enter}");
    await expect(input1).toHaveValue("Orange");

    const checkButton1 = await canvas.findByRole("button");
    await userEvent.click(checkButton1);

    const fullLabel = await canvas.findByText("Banana");
    await userEvent.click(fullLabel);

    const input2 = await canvas.findByPlaceholderText("Select a fruit full...");

    await userEvent.click(input2);
    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{enter}");
    await expect(input2).toHaveValue("Orange");

    const checkButton2 = await canvas.findByRole("button");
    await userEvent.click(checkButton2);
  },
};

export const WithDatebox: Story = {
  parameters: {
    layout: "padded",
  },

  render: () => {
    const [value, setValue] = useState({
      normal: { text: "07/25/2025", value: "07/25/2025" },
      full: { text: "07/25/2025", value: "07/25/2025" },
      keydown: { text: "07/25/2025", value: "07/25/2025" },
    });

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

    const handleChange = (e: OptionsProps, name: string) => {
      const newValue = e;
      setValue((prev) => ({ ...prev, [name]: newValue }));
    };

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="font-medium">Normal Width</span>
          <DormantText
            content={value.normal.text}
            onActionClick={() => {
              console.log(`Selected value: ${value.normal.value}`);
            }}
          >
            <Datebox
              inputValue={value.normal}
              dayNames={DAY_NAMES}
              monthNames={MONTH_NAMES}
              setInputValue={(e) => handleChange(e, "normal")}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Full Width</span>
          <DormantText
            fullWidth
            content={value.full.text}
            onActionClick={() => {
              console.log(`Selected value: ${value.full.value}`);
            }}
          >
            <Datebox
              inputValue={value.full}
              dayNames={DAY_NAMES}
              monthNames={MONTH_NAMES}
              setInputValue={(e) => handleChange(e, "full")}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">
            Change accepted by clicking some values
          </span>
          <DormantText
            fullWidth
            acceptChangeOn={"click"}
            content={value.keydown.text}
            onActionClick={() => {
              console.log(`Selected value: ${value.keydown.value}`);
            }}
          >
            <Datebox
              inputValue={value.keydown}
              dayNames={DAY_NAMES}
              monthNames={MONTH_NAMES}
              setInputValue={(e) => handleChange(e, "keydown")}
            />
          </DormantText>
        </div>
      </div>
    );
  },
};

export const WithColorbox: Story = {
  parameters: {
    layout: "padded",
  },

  render: () => {
    const [value, setValue] = useState({
      normal: "#zzzzzz",
      full: "#zzzzzz",
      keydown: "#zzzzzz",
    });

    const onChangeValue = (
      e: ChangeEvent<HTMLInputElement>,
      data: ColorPickProps
    ) => {
      const { name, value } = e.target;

      function isValidHexColor(value: string): boolean {
        const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
        return hexRegex.test(value);
      }

      if (data === "color-picker") {
        const isValidHex = isValidHexColor(value);
        setValue((prev) => ({
          ...prev,
          [name]: value,
          showError: !isValidHex,
          errorMessage: isValidHex ? "" : "Invalid color value.",
        }));
      } else if (data === "color-text") {
        let val = value;

        if (!val.startsWith("#")) {
          val = "#" + val;
        }

        const isValidHex = isValidHexColor(val);
        setValue((prev) => ({
          ...prev,
          [name]: val,
          showError: !isValidHex,
          errorMessage: isValidHex ? "" : "Invalid color value.",
        }));
      }
    };

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="font-medium">Normal Width</span>
          <DormantText
            content={value.normal}
            onActionClick={() => {
              console.log(`Selected value: ${value.normal}`);
            }}
          >
            <Colorbox
              value={value.normal}
              name="Full"
              onChange={onChangeValue}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Full Width</span>
          <DormantText
            fullWidth
            content={value.full}
            onActionClick={() => {
              console.log(`Selected value: ${value.full}`);
            }}
          >
            <Colorbox value={value.full} name="full" onChange={onChangeValue} />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">
            Change accepted by pressing enter or clicking some values
          </span>
          <DormantText
            fullWidth
            acceptChangeOn={"all"}
            content={value.keydown}
            onActionClick={() => {
              console.log(`Selected value: ${value.keydown}`);
            }}
          >
            <Colorbox
              value={value.keydown}
              name="keydown"
              onChange={onChangeValue}
            />
          </DormantText>
        </div>
      </div>
    );
  },
};

export const WithMoneybox: Story = {
  parameters: {
    layout: "padded",
  },

  render: () => {
    const [value, setValue] = useState({
      normal: "100000",
      full: "100000",
      keydown: "100000",
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    };

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="font-medium">Normal Width</span>
          <DormantText
            content={`$ ${formatMoneyboxNumber(value.normal, "comma")}`}
            onActionClick={() => {
              console.log(`Selected value: ${value.normal}`);
            }}
          >
            <Moneybox
              name="normal"
              currency="$"
              value={value.normal}
              onChange={onChangeValue}
              separator="comma"
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Full Width</span>
          <DormantText
            fullWidth
            content={`$ ${formatMoneyboxNumber(value.full, "comma")}`}
            onActionClick={() => {
              console.log(`Selected value: ${value.full}`);
            }}
          >
            <Moneybox
              name="full"
              currency="$"
              value={value.full}
              onChange={onChangeValue}
              separator="comma"
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Change accepted by pressing enter</span>
          <DormantText
            fullWidth
            acceptChangeOn={"enter"}
            content={`$ ${formatMoneyboxNumber(value.keydown || "0", "comma")}`}
            onActionClick={() => {
              console.log(`Selected value: ${value.keydown}`);
            }}
          >
            <Moneybox
              name="keydown"
              currency="$"
              value={value.keydown}
              onChange={onChangeValue}
              separator="comma"
            />
          </DormantText>
        </div>
      </div>
    );
  },
};

export const WithPhonebox: Story = {
  parameters: {
    layout: "padded",
  },

  render: () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US"
    )!;
    const [value, setValue] = useState({
      normal: {
        country_code: DEFAULT_COUNTRY_CODES,
        phone: "8123457890",
      },
      full: {
        country_code: DEFAULT_COUNTRY_CODES,
        phone: "8123457890",
      },
      keydown: {
        country_code: DEFAULT_COUNTRY_CODES,
        phone: "8123457890",
      },
    });

    const onChangeValue = (
      e:
        | ChangeEvent<HTMLInputElement>
        | { target: { name: string; value: CountryCodeProps } },
      type?: string
    ) => {
      const { name, value } = e.target;
      setValue((prev) => ({
        ...prev,
        [type]: { ...prev[type], [name]: value },
      }));
    };

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="font-medium">Normal Width</span>
          <DormantText
            content={`${value.normal.country_code.code} ${formatPhoneboxNumber(value.normal.phone, value.normal.country_code.id as CountryCode)}`}
            onActionClick={() => {
              console.log(`Selected value: ${value.normal}`);
            }}
          >
            <Phonebox
              value={value.normal.phone}
              placeholder="Enter your phone number"
              onChange={(e) => onChangeValue(e, "normal")}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Full Width</span>
          <DormantText
            fullWidth
            content={`${value.full.country_code.code} ${formatPhoneboxNumber(value.full.phone, value.full.country_code.id as CountryCode)}`}
            onActionClick={() => {
              console.log(`Selected value: ${value.full}`);
            }}
          >
            <Phonebox
              value={value.full.phone}
              placeholder="Enter your phone number"
              onChange={(e) => onChangeValue(e, "normal")}
              countryCodeValue={value.full.country_code}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Change accepted by pressing enter</span>
          <DormantText
            fullWidth
            acceptChangeOn={"enter"}
            content={`${value.keydown.country_code.code} ${formatPhoneboxNumber(value.keydown.phone, value.keydown.country_code.id as CountryCode)}`}
            onActionClick={() => {
              console.log(`Selected value: ${value.keydown}`);
            }}
          >
            <Phonebox
              value={value.keydown.phone}
              placeholder="Enter your phone number"
              onChange={(e) => onChangeValue(e, "keydown")}
              countryCodeValue={value.keydown.country_code}
            />
          </DormantText>
        </div>
      </div>
    );
  },
};

export const WithTimebox: Story = {
  parameters: {
    layout: "padded",
  },

  render: () => {
    const [value, setValue] = useState({
      normal: "12:00:00",
      keydown: "12:00:00",
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="font-medium">Normal Width</span>
          <DormantText
            content={value.normal}
            onActionClick={() => {
              console.log(`Selected value: ${value.normal}`);
            }}
          >
            <Timebox
              onChange={onChangeValue}
              value={value.normal}
              name="normal"
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Change accepted by pressing enter</span>
          <DormantText
            acceptChangeOn={"enter"}
            content={value.keydown}
            onActionClick={() => {
              console.log(`Selected value: ${value.keydown}`);
            }}
          >
            <Timebox
              onChange={onChangeValue}
              value={value.keydown}
              name="keydown"
              withSeconds
            />
          </DormantText>
        </div>
      </div>
    );
  },
};
