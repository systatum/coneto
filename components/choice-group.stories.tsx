import { Meta, StoryObj } from "@storybook/react";
import { ChoiceGroup } from "./choice-group";
import { ChangeEvent, ComponentProps, useState } from "react";
import { Radio, RadioOptionsProps } from "./radio";
import { Checkbox } from "./checkbox";
import { useArgs } from "@storybook/preview-api";
import {
  RiAlignLeft,
  RiDatabase2Fill,
  RiChat3Fill,
  RiAtFill,
  RiUserFollowFill,
  RiNotificationOffFill,
  RiMusic2Fill,
  RiImage2Fill,
  RiVideoFill,
} from "@remixicon/react";
import styled from "styled-components";

const meta: Meta<typeof ChoiceGroup> = {
  title: "Content/ChoiceGroup",
  component: ChoiceGroup,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Content children on Choice Group",
    },
    styles: {
      containerStyle: {
        control: "text",
        description:
          "Style class with styled component on Choice Group Container",
      },
      dividerStyle: {
        control: "text",
        description:
          "Style class with styled component on Choice Group Divider",
      },
    },
  },
};

export default meta;

type ChoiceGroupProps = ComponentProps<typeof ChoiceGroup>;
type StoryRadio = StoryObj<
  ChoiceGroupProps & Partial<{ radioSelected?: string }>
>;
type StoryCheckbox = StoryObj<
  ChoiceGroupProps & Partial<{ valueSelected?: string[] }>
>;

export const WithRadio: StoryRadio = {
  argTypes: {
    radioSelected: {
      control: "radio",
    },
  },
  args: {
    radioSelected: "comments",
  },

  render: (args) => {
    const RADIO_OPTIONS: RadioOptionsProps[] = [
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

    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <ChoiceGroup>
        {RADIO_OPTIONS.map((option, index) => {
          return (
            <Radio
              key={index}
              name="radioSelected"
              value={option.value}
              label={option.label}
              description={option.description}
              checked={args.radioSelected === option.value}
              onChange={onChangeValue}
            />
          );
        })}
      </ChoiceGroup>
    );
  },
};

export const WithRadioAndIcon: StoryRadio = {
  argTypes: {
    radioSelected: {
      control: "radio",
    },
  },
  args: {
    radioSelected: "comments",
  },

  render: (args) => {
    const RADIO_OPTIONS: RadioOptionsProps[] = [
      {
        value: "comments",
        label: "Comments",
        description: "Get notified when someone posts a comment",
        icon: RiChat3Fill,
      },
      {
        value: "mentions",
        label: "Mentions",
        description: "Get notified when someone mentions you",
        icon: RiAtFill,
      },
      {
        value: "follows",
        label: "Follows",
        description: "Get notified when someone follows you",
        icon: RiUserFollowFill,
      },
      {
        value: "none",
        label: "None",
        description: "Don't notify me",
        icon: RiNotificationOffFill,
      },
    ];

    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <ChoiceGroup>
        {RADIO_OPTIONS.map((option, index) => {
          return (
            <Radio
              key={index}
              name="radioSelected"
              value={option.value}
              label={option.label}
              icon={option.icon}
              description={option.description}
              checked={args.radioSelected === option.value}
              onChange={onChangeValue}
            />
          );
        })}
      </ChoiceGroup>
    );
  },
};

export const WithRadioButton: StoryRadio = {
  render: () => {
    const [stateA, setStateA] = useState("text");
    const [stateB, setStateB] = useState("text");
    const [stateC, setStateC] = useState("text");

    const GROUP_A = "radio_group_a";
    const GROUP_B = "radio_group_b";
    const GROUP_C = "radio_group_c";

    const RADIO_OPTIONS_WITH_ICON: RadioOptionsProps[] = [
      {
        value: "text",
        label: "Text",
        icon: RiAlignLeft,
      },
      {
        value: "database",
        label: "Database",
        icon: RiDatabase2Fill,
      },
      {
        value: "music",
        label: "Music",
        icon: RiMusic2Fill,
      },
      {
        value: "image",
        label: "Image",
        icon: RiImage2Fill,
      },
      {
        value: "video",
        label: "Video",
        icon: RiVideoFill,
      },
    ];

    const RADIO_OPTIONS_WITH_IMAGE: RadioOptionsProps[] = [
      {
        value: "text",
        label: "Text",
        imageUrl: "https://picsum.photos/seed/text/64/64",
      },
      {
        value: "database",
        label: "Database",
        imageUrl: "https://picsum.photos/seed/database/64/64",
      },
      {
        value: "music",
        label: "Music",
        imageUrl: "https://picsum.photos/seed/music/64/64",
      },
      {
        value: "image",
        label: "Image",
        imageUrl: "https://picsum.photos/seed/image/64/64",
      },
      {
        value: "video",
        label: "Video",
        imageUrl: "https://picsum.photos/seed/video/64/64",
      },
    ];

    return (
      <Wrapper>
        <div
          style={{
            maxWidth: "400px",
            flexDirection: "column",
            display: "flex",
            gap: "4px",
            width: "100%",
          }}
        >
          <h2>Default</h2>
          <ChoiceGroup>
            {RADIO_OPTIONS_WITH_ICON.slice(0, 2).map((option, index) => {
              return (
                <Radio
                  mode="button"
                  key={index}
                  name={GROUP_A}
                  value={option.value}
                  label={option.label}
                  icon={option.icon}
                  checked={stateA === option.value}
                  onChange={(e) => setStateA(e.target.value)}
                />
              );
            })}
          </ChoiceGroup>
        </div>
        <div
          style={{
            maxWidth: "600px",
            flexDirection: "column",
            display: "flex",
            gap: "4px",
            width: "100%",
          }}
        >
          <h2>Space constrained</h2>
          <ChoiceGroup>
            {RADIO_OPTIONS_WITH_ICON.map((option, index) => {
              return (
                <Radio
                  mode="button"
                  key={index}
                  name={GROUP_B}
                  value={option.value}
                  label={option.label}
                  icon={option.icon}
                  checked={stateB === option.value}
                  onChange={(e) => setStateB(e.target.value)}
                />
              );
            })}
          </ChoiceGroup>
        </div>
        <div
          style={{
            maxWidth: "600px",
            flexDirection: "column",
            display: "flex",
            gap: "4px",
            width: "100%",
          }}
        >
          <h2>With Image</h2>
          <ChoiceGroup>
            {RADIO_OPTIONS_WITH_IMAGE.map((option, index) => {
              return (
                <Radio
                  mode="button"
                  key={index}
                  name={GROUP_C}
                  value={option.value}
                  label={option.label}
                  imageUrl={option.imageUrl}
                  checked={stateC === option.value}
                  onChange={(e) => setStateC(e.target.value)}
                />
              );
            })}
          </ChoiceGroup>
        </div>
      </Wrapper>
    );
  },
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const WithCheckbox: StoryCheckbox = {
  args: {
    valueSelected: [],
  },
  render: () => {
    interface CheckboxOptionsProps {
      value: string;
      label: string;
      description: string;
    }

    const CHECKBOX_OPTIONS: CheckboxOptionsProps[] = [
      {
        value: "email",
        label: "Email",
        description: "Receive updates via email",
      },
      {
        value: "push",
        label: "Push Notifications",
        description: "Receive updates via push notifications",
      },
      {
        value: "sms",
        label: "SMS",
        description: "Receive updates via text messages",
      },
    ];

    const [selected, setSelected] = useState({
      checked: [] as CheckboxOptionsProps[],
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue, checked, type } = e.target;

      if (type === "checkbox") {
        const parsed = JSON.parse(inputValue);
        setSelected((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], parsed]
            : prev[name].filter(
                (val: CheckboxOptionsProps) => val.value !== parsed.value
              ),
        }));
      } else {
        setSelected((prev) => ({ ...prev, [name]: inputValue }));
      }
    };

    return (
      <ChoiceGroup>
        {CHECKBOX_OPTIONS.map((option, index) => (
          <Checkbox
            key={index}
            name="checked"
            value={JSON.stringify(option)}
            description={option.description}
            label={option.label}
            checked={selected.checked.some(
              (item) => item.value === option.value
            )}
            onChange={onChangeValue}
          />
        ))}
      </ChoiceGroup>
    );
  },
};
