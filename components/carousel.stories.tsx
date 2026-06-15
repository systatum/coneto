import { Meta, StoryObj } from "@storybook/react/*";
import { Carousel } from "./carousel";
import { useState } from "react";

const meta: Meta<typeof Carousel> = {
  title: "Stage/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
                
            `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => {
    const [state, setState] = useState(0);

    return (
      <Carousel
        control={{
          onChange: (page) => setState(page),
        }}
        currentPage={state}
        onNextPageRequested={({ nextPage }) => {
          setState(nextPage);
        }}
        onPrevPageRequested={({ prevPage }) => {
          setState(prevPage);
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              height: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "4rem",
              fontWeight: 700,
              background: `hsl(${i * 36}, 70%, 85%)`,
              borderRadius: 12,
            }}
          >
            {i + 1}
          </div>
        ))}
      </Carousel>
    );
  },
};
