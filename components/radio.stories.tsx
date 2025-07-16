import { Meta, StoryObj } from "@storybook/react";
import Radio from "./radio";
import { ChangeEvent, ComponentProps } from "react";
import { useArgs } from "@storybook/preview-api";
import { userEvent, within } from "@storybook/test";

const meta: Meta<typeof Radio> = {
  title: "Input Elements/Radio",
  component: Radio,
  tags: ["autodocs"],
};

export default meta;

type RadioProps = ComponentProps<typeof Radio>;
type Story = StoryObj<RadioProps & Partial<{ radioSelected?: string }>>;

const RADIO_OPTIONS = [
  {
    value: "comments",
    label: "Comments",
    description: "Get notified when someone posts a comment",
  },
  {
    value: "mentions",
    label: "Mentions",
    description: "Get notified when someone mentions you",
  },
  {
    value: "follows",
    label: "Follows",
    description: "Get notified when someone follows you",
  },
  {
    value: "none",
    label: "None",
    description: "Don't notify me",
  },
];

export const Default: Story = {
  args: {
    radioSelected: "comments",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <div>
        {RADIO_OPTIONS.map((option, index) => (
          <Radio
            key={index}
            name="radioSelected"
            value={option.value}
            label={option.label}
            checked={args.radioSelected === option.value}
            onChange={onChangeValue}
          />
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const radios = await canvas.findAllByRole("radio");
    await userEvent.click(radios[1]);
  },
};

export const WithDescription: Story = {
  argTypes: {
    radioSelected: {
      control: "radio",
      options: RADIO_OPTIONS.map((val) => val.value),
    },
  },
  args: {
    radioSelected: "comments",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <div>
        {RADIO_OPTIONS.map((option, index) => (
          <Radio
            key={index}
            name="radioSelected"
            value={option.value}
            label={option.label}
            description={option.description}
            checked={args.radioSelected === option.value}
            onChange={onChangeValue}
          />
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const radios = await canvas.findAllByRole("radio");
    await userEvent.click(radios[1]);
  },
};
