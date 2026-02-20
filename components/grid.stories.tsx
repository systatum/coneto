import { Meta, StoryObj } from "@storybook/react";
import { Grid } from "./grid";
import { useState } from "react";

const meta: Meta<typeof Grid> = {
  title: "Content/Grid",
  component: Grid,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description: "Grid items. Usually `Grid.Card` components.",
    },
    gap: {
      control: "text",
      description:
        "Spacing between grid items. Can be a number (px) or any valid CSS size (e.g. `1rem`, `8px`).",
    },
    height: {
      control: "text",
      description:
        "Optional height for the grid container. Accepts number (px) or any valid CSS value.",
    },
    width: {
      control: "text",
      description:
        "Optional width for the grid container. Accepts number (px) or any valid CSS value.",
    },
    preset: {
      control: { type: "select" },
      options: [
        "1-col",
        "2-col",
        "3-col",
        "4-col",
        "5-col",
        "6-col",
        "13-col",
        "16-col",
        "1-to-3",
        "1-to-4",
        "2-to-4",
        "3-to-5",
        "1-to-6",
        "auto-fit-400",
        "auto-fit-350",
        "auto-fit-300",
        "auto-fit-250",
        "auto-fit-200",
      ],
      description:
        "Predefined responsive grid layouts. These control how many columns are shown at different breakpoints.",
    },
    styles: {
      control: false,
      description: `
Custom styles for the Grid container (self).

This allows you to override layout and visual styles of the grid wrapper (e.g. padding, background, borders, max-width, etc).

Accepts a \`CSSProp\` (styled-components compatible).
    `,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Grid>;

export const Fit200PX: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    return (
      <Grid gap={8} preset="auto-fit-200">
        {data.map((data) => (
          <Grid.Card key={data.id} thumbnail={data.image}>
            <div
              style={{
                minHeight: "30px",
                width: "100%",
                height: "100%",
              }}
            >
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};

export const Fit250PX: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    return (
      <Grid gap={8} preset="auto-fit-250">
        {data.map((data) => (
          <Grid.Card key={data.id} thumbnail={data.image}>
            <div
              style={{
                minHeight: "30px",
                width: "100%",
                height: "100%",
              }}
            >
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};

export const Fit300PX: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    return (
      <Grid gap={8} preset="auto-fit-300">
        {data.map((data) => (
          <Grid.Card key={data.id} thumbnail={data.image}>
            <div
              style={{
                minHeight: "30px",
                width: "100%",
                height: "100%",
              }}
            >
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};

export const Fit350PX: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    return (
      <Grid gap={8} preset="auto-fit-350">
        {data.map((data) => (
          <Grid.Card key={data.id} thumbnail={data.image}>
            <div
              style={{
                minHeight: "30px",
                width: "100%",
                height: "100%",
              }}
            >
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};

export const Fit400PX: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    return (
      <Grid gap={8} preset="auto-fit-400">
        {data.map((data) => (
          <Grid.Card key={data.id} thumbnail={data.image}>
            <div
              style={{
                minHeight: "30px",
                width: "100%",
                height: "100%",
              }}
            >
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};

export const OneToThree: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    return (
      <Grid gap={8} preset="1-to-3">
        {data.map((data) => (
          <Grid.Card key={data.id} thumbnail={data.image}>
            <div
              style={{
                minHeight: "30px",
                width: "100%",
                height: "100%",
              }}
            >
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};

export const OneToFour: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    return (
      <Grid gap={8} preset="1-to-4">
        {data.map((data) => (
          <Grid.Card key={data.id} thumbnail={data.image}>
            <div
              style={{
                minHeight: "30px",
                width: "100%",
                height: "100%",
              }}
            >
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};

export const OneToSix: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    return (
      <Grid gap={8} preset="1-to-6">
        {data.map((data) => (
          <Grid.Card key={data.id} thumbnail={data.image}>
            <div
              style={{
                minHeight: "30px",
                width: "100%",
                height: "100%",
              }}
            >
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};

export const TwoToFour: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    return (
      <Grid gap={8} preset="2-to-4">
        {data.map((data) => (
          <Grid.Card key={data.id} thumbnail={data.image}>
            <div
              style={{
                minHeight: "30px",
                width: "100%",
                height: "100%",
              }}
            >
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};

export const ThreeToFive: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    return (
      <Grid gap={8} preset="3-to-5">
        {data.map((data) => (
          <Grid.Card key={data.id} thumbnail={data.image}>
            <div
              style={{
                minHeight: "30px",
                width: "100%",
                height: "100%",
              }}
            >
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};

export const WithSelectable: Story = {
  render: () => {
    interface ImageProps {
      id: number;
      image: string;
      title: string;
    }
    const [value, setValue] = useState<number[]>([]);

    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    const handleSelect = (val: ImageProps) => {
      const valId = val?.id;
      const isAlreadySelected = value.some((data) => data === valId);
      if (isAlreadySelected) {
        setValue((prev) => prev.filter((data) => data !== valId));
      } else {
        setValue([...value, valId]);
      }
    };

    return (
      <Grid gap={8} preset="1-to-3">
        {data.map((data) => {
          const dataId = data.id;
          const isSelected = value.some((val) => val === dataId);

          return (
            <Grid.Card
              key={data.id}
              thumbnail={data.image}
              onSelected={() => handleSelect(data)}
              isSelected={isSelected}
              selectable
            >
              <div
                style={{
                  minHeight: "30px",
                  width: "100%",
                  height: "100%",
                }}
              >
                <h3>{data.title}</h3>
              </div>
            </Grid.Card>
          );
        })}
      </Grid>
    );
  },
};
