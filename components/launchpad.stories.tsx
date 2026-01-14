import { Meta, StoryObj } from "@storybook/react";
import { Launchpad } from "./launchpad";
import { css } from "styled-components";

const meta: Meta<typeof Launchpad> = {
  title: "Content/Launchpad",
  component: Launchpad,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description:
        "Launchpad content. Use `Launchpad.Section` components as children.",
    },
    containerStyle: {
      control: false,
      description: "Custom CSSProp applied to the root Launchpad container.",
    },
    maxSection: {
      control: "number",
      description:
        "Maximum number of sections shown per page. Additional sections will be paginated and swipeable.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const LAUNCHPAD_SECTIONS = [
      {
        title: "SigmaMewing",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/sigma/${i + 1}`,
          label: `Sigma ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 1}`,
        })),
      },
      {
        title: "Alpha",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/alpha/${i + 1}`,
          label: `Alpha ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 101}`,
        })),
      },
      {
        title: "Beta",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/beta/${i + 1}`,
          label: `Beta ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 201}`,
        })),
      },
      {
        title: "Gamma",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/gamma/${i + 1}`,
          label: `Gamma ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 301}`,
        })),
      },
      {
        title: "Delta",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/delta/${i + 1}`,
          label: `Delta ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 401}`,
        })),
      },
      {
        title: "Epsilon",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/epsilon/${i + 1}`,
          label: `Epsilon ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 501}`,
        })),
      },
      {
        title: "Zeta",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/zeta/${i + 1}`,
          label: `Zeta ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 601}`,
        })),
      },
      {
        title: "Theta",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/theta/${i + 1}`,
          label: `Theta ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 701}`,
        })),
      },
      {
        title: "Lambda",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/lambda/${i + 1}`,
          label: `Lambda ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 801}`,
        })),
      },
      {
        title: "Kappa",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/kappa/${i + 1}`,
          label: `Kappa ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 901}`,
        })),
      },
      {
        title: "Iota",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/iota/${i + 1}`,
          label: `Iota ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 1001}`,
        })),
      },
      {
        title: "Omicron",
        items: Array.from({ length: 8 }, (_, i) => ({
          href: `/omicron/${i + 1}`,
          label: `Omicron ${i + 1}`,
          iconUrl: `https://picsum.photos/200?random=${i + 1101}`,
        })),
      },
    ];

    return (
      <Launchpad>
        {LAUNCHPAD_SECTIONS.map((data, index) => (
          <Launchpad.Section gridPreset="1-to-3" title={data.title} key={index}>
            {data.items.map((item, itemIndex) => (
              <Launchpad.Section.Item
                styles={{
                  containerStyle: css`
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding-left: 1rem;
                    padding-right: 1rem;

                    @media (min-width: 640px) {
                      flex-direction: column;
                      padding-left: 0;
                      padding-right: 0;
                    }
                  `,
                }}
                key={itemIndex}
                {...item}
              />
            ))}
          </Launchpad.Section>
        ))}
      </Launchpad>
    );
  },
};
