import type { Meta, StoryObj } from "@storybook/react";
import {
  LoadingSkeleton,
  LoadingSkeletonOptionsProps,
} from "./loading-skeleton";
import { css } from "styled-components";
import { Grid } from "./grid";

const meta: Meta<typeof LoadingSkeleton> = {
  title: "Feedback/LoadingSkeleton",
  component: LoadingSkeleton,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description:
        "Skeleton items rendered inside the wrapper. Use `LoadingSkeleton.Item` to define individual loading blocks.",
    },
    styles: {
      control: false,
      description:
        "Custom styled-components CSS applied to the skeleton wrapper. Useful for layout styling such as borders, padding, width, or background.",
    },
    flashDirection: {
      control: {
        type: "select",
      },
      options: [
        "left-to-right",
        "right-to-left",
        "top-to-bottom",
        "bottom-to-top",
      ],
      description:
        "Controls the shimmer animation direction applied to all skeleton items inside the wrapper.",
      table: {
        defaultValue: { summary: "left-to-right" },
      },
    },
    flashRate: {
      control: {
        type: "select",
      },
      options: ["slow", "normal", "fast"],
      description:
        "Controls the shimmer animation speed. You can also pass a number to define a custom duration in seconds.",
      table: {
        defaultValue: { summary: "normal" },
      },
    },
    baseColor: {
      control: "color",
      description:
        "The base color of the skeleton background. This is the main color behind the shimmer effect.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "#eee" },
      },
    },
    highlightColor: {
      control: "color",
      description:
        "The highlight color used in the shimmer animation. This creates the glowing effect over the `baseColor`.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "#f5f5f5" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSkeleton>;

export const Card: Story = {
  render: () => {
    const CARD_SAMPLE: LoadingSkeletonOptionsProps[] = [
      {
        flashDirection: "left-to-right",
        flashRate: "normal",
      },
      {
        flashDirection: "right-to-left",
        flashRate: "fast",
      },
      {
        flashDirection: "top-to-bottom",
        flashRate: "slow",
      },
      {
        flashDirection: "bottom-to-top",
        flashRate: 1.2,
      },
    ];

    return (
      <Grid gap={20} preset="1-to-4">
        {CARD_SAMPLE.map((props, i) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span>
              Card with {props.flashDirection} flash direction and{" "}
              {typeof props.flashRate === "number"
                ? `${props.flashRate}s speed (custom number)`
                : `${props.flashRate} speed`}
            </span>

            <LoadingSkeleton
              key={i}
              flashDirection={props.flashDirection}
              flashRate={props.flashRate}
              styles={{
                self: css`
                  border: 1px solid #eee;
                  border-radius: 8px;
                  width: 300px;
                `,
              }}
            >
              <LoadingSkeleton.Item height={180} />
              <LoadingSkeleton.Item
                height={21}
                width="70%"
                styles={{
                  self: css`
                    margin-top: 6px;
                  `,
                }}
              />
              <LoadingSkeleton.Item
                height={16}
                styles={{
                  self: css`
                    margin-top: 8px;
                  `,
                }}
              />
              <LoadingSkeleton.Item
                height={16}
                width="80%"
                styles={{
                  self: css`
                    margin-top: 6px;
                  `,
                }}
              />
            </LoadingSkeleton>
          </div>
        ))}
      </Grid>
    );
  },
};
