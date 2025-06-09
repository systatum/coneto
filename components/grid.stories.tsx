import { Meta, StoryObj } from "@storybook/react";
import { Grid } from "./grid";

const meta: Meta<typeof Grid> = {
  title: "Content/Grid",
  component: Grid,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Grid>;

export const Default: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/200?random=${i + 1}`,
      title: `Card Heading ${i}`,
    }));

    const handleSelect = (selectedData) => {
      console.log(selectedData);
    };

    return (
      <Grid
        gap={8}
        columns={{
          base: 1,
          sm: 2,
          md: 3,
          lg: 4,
        }}
      >
        {data.map((data) => (
          <Grid.Card
            key={data.id}
            thumbnail={data.image}
            onSelected={() => handleSelect(data)}
          >
            <div className="min-h-[30px] h-full w-full">
              <h3>{data.title}</h3>
            </div>
          </Grid.Card>
        ))}
      </Grid>
    );
  },
};
