import { Meta, StoryObj } from "@storybook/react";
import { TreeList } from "./treelist";

const meta: Meta<typeof TreeList> = {
  title: "Content/TreeList",
  component: TreeList,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TreeList>;

export const Default: Story = {
  render: () => {
    const setPerson = (item: { id: number; label: string }) => {
      console.log("Clicked person:", item.label);
    };

    const TREE_LIST_DATA = [
      {
        label: "Member of Technical Staff",
        items: [
          { id: 1, label: "Adam Noto Hakarsa", onClick: setPerson },
          { id: 2, label: "Mohamad Naufal Alim", onClick: setPerson },
        ],
      },
      {
        label: "Product Management Team",
        items: [
          { id: 1, label: "Samantha Lee", onClick: setPerson },
          { id: 2, label: "Jason Kim", onClick: setPerson },
          { id: 3, label: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    return (
      <div className="flex flex-col gap-1 max-w-[250px]">
        <TreeList
          content={TREE_LIST_DATA}
          emptySlate={
            <div className="text-sm font-semibold w-full items-center flex">
              Not found.
            </div>
          }
        />
      </div>
    );
  },
};
