import { Meta, StoryObj } from "@storybook/react";
import { Grid } from "./grid";
import { useState } from "react";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Grid> = {
  title: "Content/Grid",
  component: Grid,
  tags: ["autodocs"],
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
            <div className="min-h-[30px] h-full w-full">
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
            <div className="min-h-[30px] h-full w-full">
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
            <div className="min-h-[30px] h-full w-full">
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
            <div className="min-h-[30px] h-full w-full">
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
            <div className="min-h-[30px] h-full w-full">
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
            <div className="min-h-[30px] h-full w-full">
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
            <div className="min-h-[30px] h-full w-full">
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
            <div className="min-h-[30px] h-full w-full">
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
            <div className="min-h-[30px] h-full w-full">
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
            <div className="min-h-[30px] h-full w-full">
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
              selectable
              isSelected={isSelected}
              data-testid={`card-${data.id}`}
              data-selected={isSelected}
            >
              <div className="min-h-[30px] h-full w-full">
                <h3>{data.title}</h3>
              </div>
            </Grid.Card>
          );
        })}
      </Grid>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstCard = await canvas.findByTestId("card-1");
    await userEvent.click(firstCard);
    expect(firstCard).toHaveAttribute("data-selected", "true");
    await userEvent.click(firstCard);
    expect(firstCard).toHaveAttribute("data-selected", "false");
  },
};
