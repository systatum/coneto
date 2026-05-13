import { Meta, StoryObj } from "@storybook/react";
import { Title, TitleSection } from "./title";
import { Ri24HoursFill, RiCloseLine } from "@remixicon/react";
import { css } from "styled-components";

const meta: Meta<typeof Title> = {
  title: "Content/Title",
  component: Title,
  parameters: {
    layout: "centered",
    docs: {},
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Title>;

export const WithACustomAction: Story = {
  render: () => {
    const rightSection: TitleSection[] = [
      {
        styles: {
          toggleActionStyle: css`
            padding: 2px;
            width: 20px;
            height: 20px;
          `,
        },
        actions: [
          {
            icon: { image: RiCloseLine },
            onClick: () => {},
          },
        ],
      },
    ];

    return (
      <>
        <Title
          size="sm"
          text="Default Modal"
          subtitle="Here is the content of the modal dialog."
          icon={{
            image: Ri24HoursFill,
          }}
          rightSection={rightSection}
        />
        <Title
          size="md"
          text="Default Modal"
          subtitle="Here is the content of the modal dialog."
          icon={{
            image: Ri24HoursFill,
          }}
          rightSection={rightSection}
        />
        <Title
          size="lg"
          text="Default Modal"
          subtitle="Here is the content of the modal dialog."
          icon={{
            image: Ri24HoursFill,
          }}
          rightSection={rightSection}
        />
      </>
    );
  },
};
