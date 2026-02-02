import type { Meta, StoryObj } from "@storybook/react";
import { LoadingSkeleton } from "./loading-skeleton";
import { css } from "styled-components";
import { Grid } from "./grid";

const meta: Meta<typeof LoadingSkeleton> = {
  title: "Feedback/LoadingSkeleton",
  component: LoadingSkeleton,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description: "Skeleton items rendered inside the wrapper.",
    },
    style: {
      control: false,
      description:
        "Custom styled-components CSS applied to the skeleton wrapper.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSkeleton>;

export const Card: Story = {
  render: () => (
    <Grid>
      {Array.from({ length: 3 }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          style={css`
            border: 1px solid #eee;
            border-radius: 8px;
            width: 300px;
          `}
        >
          <LoadingSkeleton.Item height={180} />
          <LoadingSkeleton.Item
            height={21}
            width="70%"
            style={{ marginTop: 16 }}
          />
          <LoadingSkeleton.Item height={16} style={{ marginTop: 8 }} />
          <LoadingSkeleton.Item
            height={16}
            width="80%"
            style={{ marginTop: 6 }}
          />
        </LoadingSkeleton>
      ))}
    </Grid>
  ),
};
